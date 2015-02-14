<?php
// **** POTENTIAL CONFIGURATION STARTS HERE ****

// NOTE: If you don't have the OAuth extension hooked into PHP, you may need
//  to include it here.

// MODIFY: Insert whichever URL you'd like to try below. By default, the 
//  following URL will try to pull out the NFL teams for the logged-in user
$url = 'http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nfl/teams'; 
$scope = 'test';

// MODIFY: Insert your own consumer key and secret here!
$consumer_data = array();
$consumer_data['test']['key'] = 'dj0yJmk9N2Z2aURKNGhONzUyJmQ9WVdrOWIybE1kbWh3TnpRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02NQ--';
$consumer_data['test']['secret'] = 'd1394963009dd3c2454f2323c2e79c3795836f1c';


// **** MAIN PROGRAM START HERE ****

$consumer_key = $consumer_data[$scope]['key'];
$consumer_secret = $consumer_data[$scope]['secret'];

// By default, try to store token information in /tmp folder
$token_file_name = '/tmp/oauth_data_token_storage_' . $consumer_key . '.out';

$access_token = NULL;
$access_secret = NULL;
$access_session = NULL;
$access_verifier = NULL;
$store_access_token_data = false;

if( file_exists( $token_file_name ) && 
    $tok_fh = fopen( $token_file_name, 'r' ) ) {

  $invalid_file = false;

  // Get first line: access token
  $access_token = fgets( $tok_fh );
  if( $access_token ) {
    // Get next line: access secret
    $access_secret = fgets( $tok_fh );
    if( $access_secret ) {
      // Get next line: access session handle
      $access_session = fgets( $tok_fh );
      if( ! $access_session ) {
        $invalid_file = true;
      }
    } else {
      $invalid_file = true;
    }
  } else {
    $invalid_file = true;
  }

  if( $invalid_file ) {
    print "File did not seem to be formatted correctly -- needs 3 lines with access token, secret, and session handle.\n";
    $access_token = NULL;
    $access_secret = NULL;
    $access_session = NULL;
  } else {
    print "Got access token information!\n";

    $access_token = rtrim( $access_token );
    $access_secret = rtrim( $access_secret );
    $access_session = rtrim( $access_session );

    print " Token: ${access_token}\n";
    print " Secret: ${access_secret}\n";
    print " Session Handle: ${access_session}\n\n";
  }
  
  // Done with file, close it up
  fclose( $tok_fh );

} else {
  print "Couldn't open ${token_file_name}, assuming we need to get a new request token.\n";
}

// 1. See if we have a stored access token/secret/session. If so, try to use
//    that token.
if( $access_token ) {

  $o = new OAuth( $consumer_key, $consumer_secret,
                  OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI );
  $o->enableDebug();

  $auth_failure = false;
  
  // Try to make request using stored token
  try {
    $o->setToken( $access_token, $access_secret );
    if( $o->fetch( $url ) ) {
      print "Got data from API:\n\n";
      print $o->getLastResponse() . "\n\n";

      print "Successful!\n";
      exit;
    } else {
      print "Couldn'\t fetch\n";
    }
  } catch( OAuthException $e ) {
    print 'Error: ' . $e->getMessage() . "\n";
    print 'Error Code: ' . $e->getCode() . "\n";
    print 'Response: ' . $e->lastResponse . "\n";

    if( $e->getCode() == 401 ) {
      $auth_failure = true;
    }
  }


  // 2. If we get an auth error, try to refresh the token using the session.
  if( $auth_failure ) {
    
    try {
      $response = $o->getAccessToken( 'https://api.login.yahoo.com/oauth/v2/get_token', $access_session, $access_verifier );
    } catch( OAuthException $e ) {
      print 'Error: ' . $e->getMessage() . "\n";
      print 'Response: ' . $e->lastResponse . "\n";

      $response = NULL;
    }

    print_r( $response );

    if( $response ) {
      $access_token = $response['oauth_token'];
      $access_secret = $response['oauth_token_secret'];
      $access_session = $response['oauth_session_handle'];
      $store_access_token_data = true;

      print "Was able to refresh access token:\n";
      print " Token: ${access_token}\n";
      print " Secret: ${access_secret}\n";
      print " Session Handle: ${access_session}\n\n";

    } else {
      
      $access_token = NULL;
      $access_secret = NULL;
      $access_session = NULL;
      print "Unable to refresh access token, will need to request a new one.\n";
    }
  }
}

// 3. If none of that worked, send the user to get a new token
if( ! $access_token ) {
  
  print "Better try to get a new access token.\n";
  $o = new OAuth( $consumer_key, $consumer_secret,
                  OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI );
  $o->enableDebug();

  $request_token = NULL;

  try {
    $response = $o->getRequestToken( "https://api.login.yahoo.com/oauth/v2/get_request_token", 'oob' );
    $request_token = $response['oauth_token'];
    $request_secret = $response['oauth_token_secret'];

    print "Hey! Go to this URL and tell us the verifier you get at the end.\n";
    print ' ' . $response['xoauth_request_auth_url'] . "\n";

  } catch( OAuthException $e ) {
    print $e->getMessage() . "\n";
  }

  // Wait for input, then try to use it to get a new access token.
  if( $request_token && $request_secret ) {
    print "Type the verifier and hit enter...\n";
    $verifier = fgets( STDIN );
    $verifier = rtrim( $verifier );
    
    print "Here's the verifier you gave us: ${verifier}\n";
    
    try {
      $o->setToken( $request_token, $request_secret );
      $response = $o->getAccessToken( 'https://api.login.yahoo.com/oauth/v2/get_token', NULL, $verifier );

      print "Got it!\n";
      $access_token = $response['oauth_token'];
      $access_secret = $response['oauth_token_secret'];
      $access_session = $response['oauth_session_handle'];
      $store_access_token_data = true;
      print " Token: ${access_token}\n";
      print " Secret: ${access_secret}\n";
      print " Session Handle: ${access_session}\n\n";


    } catch( OAuthException $e ) {
      print 'Error: ' . $e->getMessage() . "\n";
      print 'Response: ' . $e->lastResponse . "\n";
      print "Shoot, couldn't get the access token. :(\n";
    }
  }

}

if( $access_token ) {

  // Try to make request using stored token
  try {
    $o->setToken( $access_token, $access_secret );
    if( $o->fetch( $url ) ) {
      print "Got data from API:\n\n";
      print $o->getLastResponse() . "\n\n";

      print "Successful!\n";
    } else {
      print "Couldn'\t fetch\n";
    }
  } catch( OAuthException $e ) {
    print 'Error: ' . $e->getMessage() . "\n";
    print 'Error Code: ' . $e->getCode() . "\n";
    print 'Response: ' . $e->lastResponse . "\n";
  }
}

// 4. Rewrite token information if necessary
if( $store_access_token_data ) {

  print "Looks like we need to store access token data! Doing that now.\n";

  $tok_fh = fopen( $token_file_name, 'w' );
  if( $tok_fh ) {
    fwrite( $tok_fh, "${access_token}\n" );
    fwrite( $tok_fh, "${access_secret}\n" );
    fwrite( $tok_fh, "${access_session}\n" );
    
    fclose( $tok_fh );
  } else {
    print "Hm, couldn't open file to write back access token information.\n";
  }
}
?>

        