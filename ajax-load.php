<?php
/*
Plugin Name: Ajax Load
Plugin URI: http://planet-it.biz/
Description: Short Description
Version: 1.0
Author: Eugeny Silin (Planet IT Team)
Author URI: http://planet-it.biz/
*/

function register_ajax_js()
{
    wp_register_script('ajax-load_link', plugins_url() . '/ajax-load/js/ajax-load_link.js', ['jquery'], '', true);
    wp_register_script('ajax-load_form', plugins_url() . '/ajax-load/js/ajax-load_form.js', ['jquery'], '', true);
    wp_enqueue_script('ajax-load_link');
    wp_enqueue_script('ajax-load_form');
}

add_action('wp_enqueue_scripts', 'register_ajax_js', 200);

