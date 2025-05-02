import os
import feedparser
import requests
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from dao import govPolicyDao, welfarePolicyDao

class BasePolicyIngestion:
    def __init__(self, dao):
        self.dao = dao
        
    def process_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Process and normalize policy item data"""
        # Add creation timestamp
        item['created_at'] = datetime.now().isoformat()
        
        # Validate required fields
        required_fields = ['title', 'agency', 'apply_url']
        for field in required_fields:
            if field not in item or not item[field]:
                raise ValueError(f"Missing required field: {field}")
        
        return item
    
    def save_policy(self, item: Dict[str, Any]) -> str:
        """Save policy to database after processing"""
        processed_item = self.process_item(item)
        
        # Check if policy already exists to avoid duplicates
        if self.dao.exists(title=processed_item['title'], agency=processed_item['agency']):
            print(f"Policy already exists: {processed_item['title']}")
            return ""
        
        # Save to database
        return self.dao.append(processed_item)

class RssFeedIngestion(BasePolicyIngestion):
    def __init__(self, dao, feed_url: str):
        super().__init__(dao)
        self.feed_url = feed_url
    
    def fetch_data(self) -> List[Dict[str, Any]]:
        """Fetch policy data from RSS feed"""
        try:
            feed = feedparser.parse(self.feed_url)
            
            if feed.bozo:  # Feed parsing error
                print(f"Error parsing feed: {feed.bozo_exception}")
                return []
            
            policies = []
            for entry in feed.entries:
                policy = {
                    'title': entry.get('title', ''),
                    'agency': entry.get('author', ''),
                    'target_group': self._extract_target_group(entry),
                    'support_type': self._extract_support_type(entry),
                    'apply_url': entry.get('link', ''),
                    'publish_from': self._parse_date(entry.get('published', '')),
                    'publish_to': self._estimate_end_date(entry.get('published', '')),
                }
                policies.append(policy)
            
            return policies
        except Exception as e:
            print(f"Error fetching RSS feed data: {str(e)}")
            return []
    
    def _extract_target_group(self, entry) -> str:
        """Extract target group from feed entry"""
        # Implementation depends on the specific RSS feed structure
        # This is a placeholder for the actual implementation
        description = entry.get('description', '')
        # Example: Look for keywords like "청년", "노인", "장애인" etc.
        return "일반"  # Default value
    
    def _extract_support_type(self, entry) -> str:
        """Extract support type from feed entry"""
        # Implementation depends on the specific RSS feed structure
        # This is a placeholder for the actual implementation
        return "기타"  # Default value
    
    def _parse_date(self, date_str: str) -> str:
        """Parse date from feed entry"""
        if not date_str:
            return datetime.now().isoformat()
        
        try:
            dt = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %z")
            return dt.isoformat()
        except ValueError:
            try:
                # Try alternative format
                dt = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S%z")
                return dt.isoformat()
            except ValueError:
                return datetime.now().isoformat()
    
    def _estimate_end_date(self, date_str: str) -> str:
        """Estimate end date based on publish date"""
        # Default: 3 months from publish date
        try:
            start_date = datetime.strptime(self._parse_date(date_str)[:10], "%Y-%m-%d")
            end_date = datetime(start_date.year + (0 if start_date.month < 10 else 1), 
                              (start_date.month + 3) % 12 or 12, 
                              start_date.day)
            return end_date.isoformat()
        except ValueError:
            # Default to 3 months from now
            now = datetime.now()
            end_date = datetime(now.year + (0 if now.month < 10 else 1), 
                              (now.month + 3) % 12 or 12, 
                              now.day)
            return end_date.isoformat()
    
    def run(self) -> int:
        """Fetch and save policies from RSS feed"""
        policies = self.fetch_data()
        count = 0
        
        for policy in policies:
            try:
                policy_id = self.save_policy(policy)
                if policy_id:
                    count += 1
                    print(f"Saved policy: {policy['title']} (ID: {policy_id})")
            except Exception as e:
                print(f"Error saving policy: {str(e)}")
        
        return count

class ApiIngestion(BasePolicyIngestion):
    def __init__(self, dao, api_url: str, api_key: str = None):
        super().__init__(dao)
        self.api_url = api_url
        self.api_key = api_key
    
    def fetch_data(self) -> List[Dict[str, Any]]:
        """Fetch policy data from API"""
        try:
            headers = {}
            if self.api_key:
                headers['Authorization'] = f"Bearer {self.api_key}"
            
            response = requests.get(self.api_url, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            return self._transform_data(data)
            
        except Exception as e:
            print(f"Error fetching API data: {str(e)}")
            return []
    
    def _transform_data(self, data: Any) -> List[Dict[str, Any]]:
        """Transform API data to policy structure"""
        # Implementation depends on the specific API structure
        # This is a placeholder for the actual implementation
        policies = []
        
        # Example transformation (adjust based on actual API response)
        if isinstance(data, dict) and 'items' in data:
            items = data['items']
        elif isinstance(data, list):
            items = data
        else:
            items = []
        
        for item in items:
            policy = {
                'title': item.get('title', ''),
                'agency': item.get('organization', ''),
                'target_group': item.get('targetGroup', '일반'),
                'support_type': item.get('supportType', '기타'),
                'apply_url': item.get('applyUrl', ''),
                'publish_from': item.get('startDate', datetime.now().isoformat()),
                'publish_to': item.get('endDate', self._default_end_date()),
            }
            policies.append(policy)
        
        return policies
    
    def _default_end_date(self) -> str:
        """Return default end date (3 months from now)"""
        now = datetime.now()
        end_date = datetime(now.year + (0 if now.month < 10 else 1), 
                          (now.month + 3) % 12 or 12, 
                          now.day)
        return end_date.isoformat()
    
    def run(self) -> int:
        """Fetch and save policies from API"""
        policies = self.fetch_data()
        count = 0
        
        for policy in policies:
            try:
                policy_id = self.save_policy(policy)
                if policy_id:
                    count += 1
                    print(f"Saved policy: {policy['title']} (ID: {policy_id})")
            except Exception as e:
                print(f"Error saving policy: {str(e)}")
        
        return count

# Sample usage
def run_ingestion():
    # Gov Policy RSS Ingestion
    gov_rss_url = os.environ.get('GOV_POLICY_RSS_URL', '')
    if gov_rss_url:
        gov_ingestion = RssFeedIngestion(govPolicyDao, gov_rss_url)
        count = gov_ingestion.run()
        print(f"Ingested {count} government policies from RSS")
    
    # Welfare Policy API Ingestion
    welfare_api_url = os.environ.get('WELFARE_POLICY_API_URL', '')
    welfare_api_key = os.environ.get('WELFARE_POLICY_API_KEY', '')
    if welfare_api_url:
        welfare_ingestion = ApiIngestion(welfarePolicyDao, welfare_api_url, welfare_api_key)
        count = welfare_ingestion.run()
        print(f"Ingested {count} welfare policies from API")

if __name__ == "__main__":
    run_ingestion() 