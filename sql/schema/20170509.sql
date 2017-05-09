ALTER TABLE member DROP COLUMN "onPaymentPlan";
ALTER TABLE member ADD COLUMN onpaymentplan BOOLEAN default FALSE;
