import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_transaction_entry(driver, base_url):
    wait = WebDriverWait(driver, 25)
    
    # --- 1. SET BUDGET FIRST ---
    print("\n[BUDGET] Navigating to Budget Setup...")
    budget_nav = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(., 'Budget Setup')]")))
    budget_nav.click()
    
    # Set Month (Current)
    current_month = time.strftime("%Y-%m")
    month_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='month']")))
    month_input.send_keys(current_month)
    
    # Set Income and manual allocation
    driver.find_element(By.XPATH, "//input[@placeholder='e.g. 50000']").send_keys("75000")
    driver.find_element(By.XPATH, "//input[@placeholder='Category (e.g. Rent)']").send_keys("General")
    driver.find_element(By.XPATH, "//input[@placeholder='₹']").send_keys("50000")
    
    # Publish Budget
    publish_btn = driver.find_element(By.XPATH, "//button[contains(., 'Publish Smart Budget')]")
    driver.execute_script("arguments[0].click();", publish_btn)
    
    # Wait for confirmation (either new or existing)
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Budget Active') or contains(text(), 'already exists')]")))
    print("✅ BUDGET: READY")
    
    # --- 2. LOG TRANSACTION ---
    print("\n[TRANSACTIONS] Testing New Entry Addition...")
    time.sleep(2) # Wait for state sync
    nav_link = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(., 'Transactions')]")))
    nav_link.click()
    
    # Add Expense
    wait.until(EC.presence_of_element_located((By.ID, "amt-input"))).send_keys("1500")
    driver.find_element(By.XPATH, "//input[@placeholder='e.g. Rent']").send_keys("Automated Test Expense")
    
    # Click Log Transaction
    log_btn = driver.find_element(By.XPATH, "//button[contains(., 'Log Transaction')]")
    driver.execute_script("arguments[0].click();", log_btn)
    
    # Wait for the input to clear (signaling success)
    print("[TRANSACTIONS] Waiting for form to reset...")
    wait.until(lambda d: d.find_element(By.ID, "amt-input").get_attribute("value") == "")
    
    # Verify Timeline Sync
    print("[TRANSACTIONS] Verifying entry in timeline...")
    # Scroll the timeline container into view
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2) 
    
    # Broad search for the transaction text anywhere on the page
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Automated Test Expense')]")))
    print("✅ TRANSACTIONS MODULE: PASSED")
