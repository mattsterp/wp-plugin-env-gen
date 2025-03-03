<?php
/**
 * Settings page functionality for Test
 *
 * @package Test
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Add settings menu item
 */
function test_add_settings_menu() {
	add_options_page(
		__( 'Test Settings', 'test' ),
		__( 'Test', 'test' ),
		'manage_options',
		'test-settings',
		'test_settings_page'
	);
}
add_action( 'admin_menu', 'test_add_settings_menu' );

/**
 * Register settings
 */
function test_register_settings() {
	// Register a new setting for our options page
	register_setting(
		'test_options',
		'test_options',
		array(
			'sanitize_callback' => 'test_validate_options',
		)
	);

	// Register a new section
	add_settings_section(
		'test_general_section',
		__( 'General Settings', 'test' ),
		'test_general_section_callback',
		'test-settings'
	);

	// Register fields
	add_settings_field(
		'test_example_field',
		__( 'Example Field', 'test' ),
		'test_example_field_callback',
		'test-settings',
		'test_general_section'
	);
}
add_action( 'admin_init', 'test_register_settings' );

/**
 * General section callback
 */
function test_general_section_callback() {
	echo '<p>' . __( 'Configure the general settings for the plugin.', 'test' ) . '</p>';
}

/**
 * Example field callback
 */
function test_example_field_callback() {
	$options = get_option( 'test_options' );
	$value = isset( $options['example_field'] ) ? $options['example_field'] : '';
	?>
	<input type="text" id="test_example_field" name="test_options[example_field]" value="<?php echo esc_attr( $value ); ?>" />
	<p class="description"><?php _e( 'Description for this field.', 'test' ); ?></p>
	<?php
}

/**
 * Validate options
 */
function test_validate_options( $input ) {
	$output = array();

	// Sanitize each option
	if ( isset( $input['example_field'] ) ) {
		$output['example_field'] = sanitize_text_field( $input['example_field'] );
	}

	return $output;
}

/**
 * Render settings page
 */
function test_settings_page() {
	// Check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		
		<form action="options.php" method="post">
			<?php
			// Output security fields
			settings_fields( 'test_options' );
			
			// Output setting sections and their fields
			do_settings_sections( 'test-settings' );
			
			// Output submit button
			submit_button();
			?>
		</form>
	</div>
	<?php
} 