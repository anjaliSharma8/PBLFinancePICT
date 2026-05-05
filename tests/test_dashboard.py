import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_ai_report_generation(driver, base_url):
    wait = WebDriverWait(driver, 25)
    
    # Range Selection
    print("\n[DASHBOARD] Testing AI Report Generation...")
    dates = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "glass-input")))
    dates[0].send_keys("01-04-2024")
    dates[1].send_keys("23-04-2024")
    
    # Trigger Audit
    audit_xpath = "//button[contains(., 'Generate Audit')]"
    wait.until(EC.element_to_be_clickable((By.XPATH, audit_xpath))).click()
    
    # Verify AI Output
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "ai-suggestions")))
    assert "AI" in driver.page_source
    print("✅ DASHBOARD AI REPORT: PASSED")
