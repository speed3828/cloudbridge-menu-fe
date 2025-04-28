CREATE TABLE IF NOT EXISTS aws_costs (
    date Date,
    amount Float64,
    currency String,
    service String,
    region String
) ENGINE = MergeTree()
ORDER BY (date, service, region);

-- Create a materialized view for daily aggregations
CREATE MATERIALIZED VIEW IF NOT EXISTS aws_costs_daily
ENGINE = SummingMergeTree()
ORDER BY (date, service, region)
AS SELECT
    date,
    service,
    region,
    sum(amount) as total_amount,
    any(currency) as currency
FROM aws_costs
GROUP BY date, service, region; 