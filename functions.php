<?php


add_action( 'wp_enqueue_scripts', 'registerScripts' );


function registerScripts(){
    wp_register_style( 'bootstrap', get_stylesheet_directory_uri() . '/libs/bootstrap.min.css', array() , 'all' );
    
    wp_enqueue_style( 'bootstrap');
    
}
