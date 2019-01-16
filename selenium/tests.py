import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ShipBuilderIntegrationTests(unittest.TestCase):

    def setUp(self):
        print("Starting webdriver...")
        self.driver = webdriver.Firefox()
        print("Firefox " + self.driver.capabilities['version'] + " webdriver started.")
        print("Retrieving URL...")
        self.driver.get("file:///work/index.html")
        print("URL retrieved.")

    def test_page_title_should_be_ShipBuilder(self):
        self.assertEqual(self.driver.title, 'ShipBuilder')

    def test_should_have_a_panel_menu(self):
        self.assertIsNotNone(self.driver.find_element_by_class_name("panel-menu"))

    def test_block_coefficient_changes_with_draught(self):
	self.driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Hull Studio'])[1]/following::p[6]").click()
        self.driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='ShipBuilder'])[2]/following::div[12]").click()
        self.assertEqual("0.22", self.driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Block coefficient Cb'])[1]/following::p[1]").text)
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.assertEqual("0.62", self.driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Block coefficient Cb'])[1]/following::p[1]").text)

    def tearDown(self):
        self.driver.close()
        print("Webdriver successfully closed.")

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(ShipBuilderIntegrationTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
