# contents of selenium_sample.py
from selenium import webdriver
print("Starting webdriver...")
driver = webdriver.Firefox()
print("Firefox webdriver started.")
print("Retrieving URL...")
driver.get("file:///work/index.html")
print("URL retrieved.")
print driver.title
driver.quit()
