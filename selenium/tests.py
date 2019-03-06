import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ShipBuilderIntegrationTests(unittest.TestCase):

    def click_on_hull_studio(self):
        self.driver.find_element_by_xpath(
            ".//p[contains(text(),'Hull')]").click()

    def click_on_modeller(self):
        self.driver.find_element_by_xpath(
            ".//p[contains(text(),'Modeller')]").click()

    def click_on_hull(self, hull_name):
        self.driver.find_element_by_xpath(
            ".//p[contains(text(),'" + hull_name + "')]").click()

    def get_block_coefficient(self):
        return self.driver.find_element_by_xpath(
            ".//*[@class='kpi block-coefficient']//*[@class='kpi-modeller-value']").text

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
        self.click_on_hull_studio()
        self.click_on_hull('anthineas')
        self.click_on_modeller()
        self.assertEqual("0.14", self.get_block_coefficient())
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.assertEqual("0.4", self.get_block_coefficient())

    def tearDown(self):
        self.driver.close()
        print("Webdriver successfully closed.")


if __name__ == "__main__":
    unittest.main()
