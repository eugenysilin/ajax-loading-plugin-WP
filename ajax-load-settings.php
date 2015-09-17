<?php
if (!current_user_can('manage_options')) {
    wp_die(__('You do not have sufficient permissions to access this page.'));
}
?>
<?php
$hidden_field_name        = 'ajax_load_settings_submit_hidden';
$opt_name_cf_class        = 'ajax_load_settings_cf_class';
$data_field_name_cf_class = 'ajax_load_settings_cf_class';

// Read in existing option value from database
$opt_val = get_option($opt_name_cf_class);

// See if the user has posted us some information
// If they did, this hidden field will be set to 'Y'
if (isset($_POST[$hidden_field_name]) && $_POST[$hidden_field_name] == 'Y') {
    // Read their posted value
    $opt_val = $_POST[$data_field_name_cf_class];

    // Save the posted value in the database
    update_option($opt_name_cf_class, $opt_val);

    // Put a "settings saved" message on the screen

    ?>

    <div class="updated">
        <p>
            <strong><?php _e('settings saved.', 'ajax-load'); ?></strong>
        </p>
    </div>
<?php

}

// Now display the settings editing screen

?>
<div class="wrap">
    <?php

    // header

    echo "<h2>" . __('Ajax Load Settings', 'ajax-load') . "</h2>";

    // settings form

    ?>
    <form name="form1" method="post" action="">
        <input type="hidden" name="<?php echo $hidden_field_name; ?>" value="Y">
        <table class="form-table">
            <tbody>
            <tr>
                <th scope="row">
                    <label for="blogname">
                        <?php _e("Contact Form CLASS:", 'ajax-load'); ?>
                    </label>
                </th>
                <td>
                    <input name="<?php echo $data_field_name_cf_class; ?>" type="text" id="<?php echo $data_field_name_cf_class; ?>" value="<?php echo $opt_val; ?>" class="regular-text">
                </td>
            </tr>
            </tbody>
        </table>
        <p class="submit">
            <input type="submit" name="Submit" class="button-primary" value="<?php esc_attr_e('Save Changes') ?>"/>
        </p>
    </form>
</div>