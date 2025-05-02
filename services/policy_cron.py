import os
import time
import schedule
import logging
from datetime import datetime
from policy_ingestion import run_ingestion
from policy_broadcast import run_broadcast

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(os.path.join(os.path.dirname(__file__), 'policy_cron.log'))
    ]
)
logger = logging.getLogger('policy_cron')

def job_ingestion():
    """Run policy ingestion job"""
    logger.info("Starting policy ingestion job")
    try:
        run_ingestion()
        logger.info("Policy ingestion job completed successfully")
    except Exception as e:
        logger.error(f"Error in policy ingestion job: {str(e)}", exc_info=True)

def job_broadcast():
    """Run policy broadcast job"""
    logger.info("Starting policy broadcast job")
    try:
        run_broadcast(hours=24)  # Broadcast policies from last 24 hours
        logger.info("Policy broadcast job completed successfully")
    except Exception as e:
        logger.error(f"Error in policy broadcast job: {str(e)}", exc_info=True)

def setup_schedule():
    """Setup schedule for jobs"""
    # Run ingestion job daily at 6:00 AM
    schedule.every().day.at("06:00").do(job_ingestion)
    logger.info("Scheduled policy ingestion job for 06:00 every day")
    
    # Run broadcast job daily at 9:00 AM
    schedule.every().day.at("09:00").do(job_broadcast)
    logger.info("Scheduled policy broadcast job for 09:00 every day")
    
    # Optional: Run another ingestion job in the afternoon
    schedule.every().day.at("15:00").do(job_ingestion)
    logger.info("Scheduled policy ingestion job for 15:00 every day")

def run_pending_jobs():
    """Run pending jobs immediately"""
    logger.info("Running pending jobs immediately")
    schedule.run_all()
    logger.info("Completed running pending jobs")

def start_scheduler():
    """Start the scheduler loop"""
    logger.info("Starting scheduler")
    
    try:
        # Setup job schedule
        setup_schedule()
        
        # Run pending jobs immediately on startup
        run_pending_jobs()
        
        # Run the scheduler loop
        while True:
            schedule.run_pending()
            time.sleep(60)  # Sleep for 1 minute
            
    except KeyboardInterrupt:
        logger.info("Scheduler stopped by user")
    except Exception as e:
        logger.error(f"Error in scheduler: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    start_scheduler() 