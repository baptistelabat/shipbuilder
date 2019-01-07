# contents of selenium_sample.py
from selenium import webdriver
print("Starting webdriver...")
driver = webdriver.Firefox()
print("Firefox webdriver started.")
print("Retrieving URL...")
driver.get("file:///work/index.html")
print("URL retrieved.")
title = driver.title
panel_menu = driver.find_element_by_class_name("panel-menu")
#a = driver.find_elements_by_class_name("tabs")
#print(driver.find_elements_by_class_name("panel-menu"))
#print(a)
def test_page_title_should_be_ShipBuilder():
    assert title == "ShipBuilder"

def test_should_have_a_panel_menu():
    assert panel_menu is not None

driver.quit()
