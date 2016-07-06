<?php
/*
Plugin Name: Ajax Loading
Plugin URI:
Description: The simple WP plug-in which allows to follow links and to send html-forms without reset of pages using Ajax.
Version:     1.0.0
Author:      Eugeny Silin (Sigmalion Team)
Author URI:  https://sigmalion.com.ua/
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

add_action('wp_enqueue_scripts', 'register_ajax_loading_js', 200);

function register_ajax_loading_js()
{
    wp_register_script('ajax-loading-link', plugins_url() . '/ajax-loading/js/ajax-loading-link.js', ['jquery'], '', true);
    wp_register_script('ajax-loading-form', plugins_url() . '/ajax-loading/js/ajax-loading-form.js', ['jquery'], '', true);
    wp_enqueue_script('ajax-loading-link');
    wp_enqueue_script('ajax-loading-form');
}

add_action('admin_menu', 'register_ajax_loading_settings_submenu_page');

function register_ajax_loading_settings_submenu_page()
{
    add_submenu_page('options-general.php', 'Ajax Loading Settings', 'Ajax Loading Settings', 'manage_options', 'ajax-loading-settings', 'ajax_loading_settings_submenu_page_callback');
}

function ajax_loading_settings_submenu_page_callback()
{
    require_once(plugin_dir_path(__FILE__) . 'ajax-loading-settings.php');
}

add_action('wp_head', 'ajax_loading_add_options_on_frontend');

function ajax_loading_add_options_on_frontend()
{
    echo '<meta name="plugin_ajax-loading_options" data-options_cf_form_class="' . get_option('ajax_loading_settings_cf_class') . '" />';
}