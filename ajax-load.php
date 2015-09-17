<?php
/*
Plugin Name: Ajax Load
Plugin URI: http://planet-it.biz/
Description: Short Description
Version: 1.0
Author: Eugeny Silin (Planet IT Team)
Author URI: http://planet-it.biz/
*/

add_action('wp_enqueue_scripts', 'register_ajax_js', 200);

function register_ajax_js()
{
    wp_register_script('ajax-load_link', plugins_url() . '/ajax-load/js/ajax-load_link.js', ['jquery'], '', true);
    wp_register_script('ajax-load_form', plugins_url() . '/ajax-load/js/ajax-load_form.js', ['jquery'], '', true);
    wp_enqueue_script('ajax-load_link');
    wp_enqueue_script('ajax-load_form');
}

add_action('admin_menu', 'register_ajax_load_settings_submenu_page');

function register_ajax_load_settings_submenu_page()
{
    add_submenu_page('options-general.php', 'Ajax Load Settings', 'Ajax Load Settings', 'manage_options', 'ajax-load-settings', 'ajax_load_settings_submenu_page_callback');
}

function ajax_load_settings_submenu_page_callback()
{
    require_once(plugin_dir_path(__FILE__) . 'ajax-load-settings.php');
}

add_action('wp_head', 'ajax_load_add_options_on_frontend');

function ajax_load_add_options_on_frontend()
{
    echo '<meta name="plugin_ajax-load_options" data-options_cf_form_class="' . get_option('ajax_load_settings_cf_class') . '" />';
}