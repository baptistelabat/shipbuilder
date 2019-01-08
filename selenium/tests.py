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

    def tearDown(self):
        self.driver.close()
	print("Webdriver successfully closed.")

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(ShipBuilderIntegrationTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
