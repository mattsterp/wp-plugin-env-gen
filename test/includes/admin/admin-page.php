<?php
/**
 * Admin page functionality for Test
* * @package Test */ // If this file is called directly, abort. if
( ! defined( 'WPINC' ) ) { die; } /** * Add admin menu item */ function test_add_admin_menu() { add_menu_page( __( 'Test', 'test' ), __( 'Test', 'test' ), 'manage_options', 'test', 'test_admin_page', 'dashicons-admin-generic', 100 ); } add_action( 'admin_menu',
'test_add_admin_menu' ); /** * Render admin page
content */ function test_admin_page() { // Check
user capabilities if ( ! current_user_can( 'manage_options' ) ) { return; } ?>
<div class="wrap">
  <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

  <div class="card">
    <h2><?php _e( 'Welcome to Test', 'test' ); ?></h2>
    <p>
      <?php _e( 'This is your plugin admin page.', 'test' ); ?>
    </p>
  </div>

  <div class="card">
    <h2><?php _e( 'Features', 'test' ); ?></h2>
    <ul>
      <li><?php _e( 'Feature 1', 'test' ); ?></li>
      <li><?php _e( 'Feature 2', 'test' ); ?></li>
      <li><?php _e( 'Feature 3', 'test' ); ?></li>
    </ul>
  </div>
</div>
<?php
}

/**
 * Enqueue admin styles
 */
function test_admin_styles() { $screen =
get_current_screen(); // Only load on this plugin's admin page if ( $screen &&
strpos( $screen->id, 'test' ) !== false ) { wp_enqueue_style( 'test-admin-style', TEST_URL . 'admin/css/admin.css', array(), TEST_VERSION ); } } add_action( 'admin_enqueue_scripts', 'test_admin_styles' );
