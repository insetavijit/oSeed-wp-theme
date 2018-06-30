<?php


add_action( 'wp_enqueue_scripts', 'registerScripts' );


function registerScripts(){

    $styles = [
        'bootstrap'=>"/libs/bootstrap.min.css",
        'fa'=>"/libs/font-awesome/css/font-awesome.min.css",
        'custom'=>"/libs/css/mYstyle.min.css",
    ];
    $scripts= [
        'cust'=>'/libs/js/oseed-wp-theme-bundil.min.js',
        'bootstrap'=>'/libs/bootstrap.min.js',
        'popper'=>'/libs/popper.min.js'
    ];


    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', get_stylesheet_directory_uri() . '/libs/jquery.min.js', array(), false );

    foreach ($styles as $key => $value) {
        wp_register_style( $key, get_stylesheet_directory_uri() . $value , array() , 'all' );
        wp_enqueue_style( $key );
        
    }
    foreach ($scripts as $key => $value) {
        wp_register_script( $key,  get_stylesheet_directory_uri() . $value, array('jquery'), true );
        wp_enqueue_script( $key );
        // wp_register_script( handle, src, deps, in_footer )
        
    }
    
    
}
