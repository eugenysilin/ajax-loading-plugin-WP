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
    wp_enqueue_style(
        'ajax-loading-styles',
        plugins_url() . '/ajax-loading/css/ajax-loading-styles.css',
        array(),
        true,
        'all'
    );

    wp_register_script(
        'ajax-loading-link',
        plugins_url() . '/ajax-loading/js/ajax-loading-link.js',
        array(),
        true,
        true
    );
    wp_register_script(
        'ajax-loading-form',
        plugins_url() . '/ajax-loading/js/ajax-loading-form.js',
        array(),
        true,
        true
    );

    wp_enqueue_script('ajax-loading-link');
    wp_enqueue_script('ajax-loading-form');

    $al_action_for_nonce = 'ajax-loading-nonce_' . str_replace('/', '-', get_pathname_from_url(get_permalink()));
    wp_localize_script(
        'ajax-loading-link',
        'ajaxLoading',
        array(
            'url' => admin_url('admin-ajax.php'),
            'al_action_for_nonce' => $al_action_for_nonce,
            'nonce' => wp_create_nonce($al_action_for_nonce),
            'action' => 'ajax-loading-nonce'
        )
    );
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

add_action('wp_ajax_nopriv_ajax-loading-nonce', 'ajax_loading_nonce');
add_action('wp_ajax_ajax-loading-nonce', 'ajax_loading_nonce');

function ajax_loading_nonce()
{
    $nonce = $_POST['nonce'];
    $new_nonce = wp_create_nonce($_POST['new_al_action_for_nonce']);

//    if (!wp_verify_nonce($nonce, $_POST['al_action_for_nonce']))
//        die ('Stop!');

    if ($_POST['url']) {
        echo json_encode(
            array(
                'html' => file_get_contents($_POST['url']),
                'nonce' => $new_nonce,
                'al_action_for_nonce' => $_POST['new_al_action_for_nonce']
            )
        );
    }
    wp_die();
}

function get_pathname_from_url($url)
{
    $url_params = parse_url($url);
    return $url_params['path'];
}

if (defined('DOING_AJAX') && DOING_AJAX) {
    add_action('wp_ajax_handle_frontend_ajax', 'handle_frontend_ajax_callback');
    add_action('wp_ajax_admin_only_ajax', 'admin_only_ajax_callback');
}

add_action('wp_footer', 'preload');
function preload()
{
    echo '<div class="ajax-loading-full"></div>';
    echo '<img class="ajax-loading-preload" src="' . plugins_url() . '/ajax-loading/images/default.gif" alt="default" title="default" />';
}