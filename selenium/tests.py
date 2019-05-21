import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class ShipBuilderIntegrationTests(unittest.TestCase):

    def click_on_hull_library(self):
        self.driver.find_element_by_xpath(
            ".//p[contains(text(),'Library')]").click()

    def click_on_hull(self, hull_name):
        self.driver.find_element_by_id(hull_name).click()

    def click_on_focus_hull(self):
        self.driver.find_element_by_class_name("focus-hull").click()

    def get_block_coefficient(self):
        return self.driver.find_element_by_xpath(
            ".//*[@class='kpi block-coefficient']//*[@class='kpi-modeller-value']").text

    def get_block_displacement(self):
        return self.driver.find_element_by_xpath(
            ".//*[@class='kpi displacement']//*[@class='kpi-modeller-value']").text

    def get_block_kb(self):
        return self.driver.find_element_by_xpath(
            ".//*[@class='kpi KB']//*[@class='kpi-modeller-value']").text

    def get_block_km(self):
        return self.driver.find_element_by_xpath(
            ".//*[@class='kpi KM']//*[@class='kpi-modeller-value']").text

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
        self.click_on_hull_library()
        self.click_on_hull('MPOV')
        self.click_on_focus_hull()
        self.assertEqual("0.16", self.get_block_coefficient())
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.assertEqual("0.33", self.get_block_coefficient())

    def test_126_calcul_du_kb(self):
        self.click_on_hull_library()
        self.click_on_hull('MPOV')
        self.click_on_focus_hull()
        self.assertEqual("150", self.get_block_displacement())
        self.assertEqual("1", self.get_block_kb())
        self.assertEqual("6.1", self.get_block_km())
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.driver.find_element_by_id("draught").send_keys(Keys.UP)
        self.assertEqual("1100", self.get_block_displacement())
        self.assertEqual("2.4", self.get_block_kb())
        self.assertEqual("7.2", self.get_block_km())

    def tearDown(self):
        self.driver.close()
        print("Webdriver successfully closed.")


if __name__ == "__main__":
    unittest.main()
