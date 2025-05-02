import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dao import govPolicyDao, welfarePolicyDao

class PolicyBroadcast:
    def __init__(self, dao, webhook_url=None, slack_channel=None):
        self.dao = dao
        self.webhook_url = webhook_url or os.environ.get('POLICY_WEBHOOK_URL', '')
        self.slack_channel = slack_channel or os.environ.get('POLICY_SLACK_CHANNEL', '#notifications')
    
    def get_recent_policies(self, hours=24) -> List[Dict[str, Any]]:
        """Get policies added in the last specified hours"""
        cutoff_time = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        # Query for policies created after the cutoff time
        # This assumes the dao.read() method supports filtering
        # In real implementation, this would need to be adjusted based on the actual DAO implementation
        policies = self.dao.read({"created_at": {"$gt": cutoff_time}})
        
        return policies
    
    def format_message(self, policies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Format policies into a message for broadcasting"""
        if not policies:
            return None
        
        # Count policies by agency
        agency_counts = {}
        for policy in policies:
            agency = policy.get('agency', '기타')
            agency_counts[agency] = agency_counts.get(agency, 0) + 1
        
        # Format summary message
        summary = f"📢 *{len(policies)}개*의 새로운 정책이 등록되었습니다.\n"
        
        for agency, count in agency_counts.items():
            summary += f"• {agency}: {count}개\n"
        
        # Format detailed blocks for Slack
        blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": summary
                }
            },
            {
                "type": "divider"
            }
        ]
        
        # Add details for each policy (limit to 10 to avoid excessive message size)
        for policy in policies[:10]:
            policy_block = {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*{policy.get('title', '제목 없음')}*\n"
                            f"기관: {policy.get('agency', '정보 없음')}\n"
                            f"대상: {policy.get('target_group', '정보 없음')}\n"
                            f"지원 유형: {policy.get('support_type', '정보 없음')}\n"
                            f"신청기간: {policy.get('publish_from', '')[:10]} ~ {policy.get('publish_to', '')[:10]}"
                }
            }
            
            # Add button if apply_url is available
            if policy.get('apply_url'):
                policy_block["accessory"] = {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "신청하기",
                        "emoji": True
                    },
                    "url": policy.get('apply_url')
                }
            
            blocks.append(policy_block)
            blocks.append({"type": "divider"})
        
        # Add footer with more link if there are more than 10 policies
        if len(policies) > 10:
            blocks.append({
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"*{len(policies) - 10}개*의 추가 정책이 있습니다. 웹사이트에서 확인하세요."
                    }
                ]
            })
        
        # Format for Slack
        message = {
            "channel": self.slack_channel,
            "text": f"{len(policies)}개의 새로운 정책이 등록되었습니다.",
            "blocks": blocks
        }
        
        return message
    
    def send_to_slack(self, message: Dict[str, Any]) -> bool:
        """Send message to Slack webhook"""
        if not self.webhook_url or not message:
            return False
        
        try:
            response = requests.post(
                self.webhook_url,
                json=message,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"Error sending message to Slack: {str(e)}")
            return False
    
    def run(self, hours=24) -> bool:
        """Run the broadcast process"""
        policies = self.get_recent_policies(hours)
        
        if not policies:
            print(f"No new policies in the last {hours} hours")
            return False
        
        print(f"Found {len(policies)} new policies")
        
        message = self.format_message(policies)
        success = self.send_to_slack(message)
        
        if success:
            print(f"Successfully sent broadcast message for {len(policies)} policies")
        else:
            print("Failed to send broadcast message")
        
        return success

def run_broadcast(hours=24):
    """Run broadcast for both government and welfare policies"""
    # Broadcast government policies
    gov_broadcast = PolicyBroadcast(govPolicyDao)
    gov_success = gov_broadcast.run(hours)
    
    # Broadcast welfare policies
    welfare_broadcast = PolicyBroadcast(welfarePolicyDao)
    welfare_success = welfare_broadcast.run(hours)
    
    return gov_success or welfare_success

if __name__ == "__main__":
    run_broadcast() 