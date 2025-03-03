<?php
/**
 * Plugin Name: Test
* Plugin URI: https://example.com/test * Description: A custom WordPress plugin * Version: 1.0.0 * Author: Your Name * Author URI:
https://example.com * License: GPL-2.0+ * License URI:
http://www.gnu.org/licenses/gpl-2.0.txt * Text Domain: test *
Domain Path: /languages */ // If this file is called directly, abort. if ( !
defined( 'WPINC' ) ) { die; } /** * Current plugin version. */ define( 'TEST_VERSION', '1.0.0' ); /** * Plugin
base path. */ define( 'TEST_PATH',
plugin_dir_path( __FILE__ ) ); /** * Plugin base URL. */ define( 'TEST_URL', plugin_dir_url( __FILE__ )
); /** * Plugin text domain. */ define( 'TEST_TEXT_DOMAIN', 'test' ); /** * Load plugin
textdomain. */ function test_load_textdomain() {
load_plugin_textdomain( 'test', false, dirname( plugin_basename(
__FILE__ ) ) . '/languages/' ); } add_action( 'plugins_loaded', 'test_load_textdomain' );  /** * Include admin page functionality. */ require_once TEST_PATH .
'includes/admin/admin-page.php';   /** *
Include settings page functionality. */ require_once TEST_PATH .
'includes/settings/settings-page.php';  /** * Begins execution of the
plugin. */ function test_init() { // Plugin
initialization code here } add_action( 'init', 'test_init' ); /** * The code that runs during plugin activation. */ function
test_activate() { // Activation code here }
register_activation_hook( __FILE__, 'test_activate' ); /** * The code that runs during plugin deactivation. */ function
test_deactivate() { // Deactivation code here }
register_deactivation_hook( __FILE__, 'test_deactivate' );
