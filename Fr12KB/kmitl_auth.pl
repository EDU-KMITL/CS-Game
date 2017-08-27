use LWP::UserAgent;
use HTTP::Cookies;
use Term::ReadKey;
use Data::Dumper;
use JSON;

$username="";
$password="";
$isLogin=0;
$message="";

%ssl_opts=(
	verify_hostname => 0,
	SSL_verify_mode => 0x00,
);
$cookie_jar=HTTP::Cookies->new(autosave=>1, hide_cookie2=>1);
$agent=LWP::UserAgent->new(
	agent => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0',
	ssl_opts => {%ssl_opts},
	timeout => 1,
	max_redirect => 0,
	cookie_jar => $cookie_jar
);
$json=JSON->new->allow_nonref;

while(1) {
	$time=localtime;
	$checkConnection=checkConnection();
	if($checkConnection==1) {
		print "[$time] Connection OK...\n";
	}else {
		system("cls");
		print " ____  __   __   ____  ____      _      ____   ____    ___   _  _____   \n";
		print "| __ ) \\ \\ / /  / ___|/ ___|    / \\    / ___| |___ \\  / _ \\ / ||___  | \n";
		print "|  _ \\  \\ V /  | |    \\___ \\   / _ \\  | |  _    __) || | | || |   / /  \n";
		print "| |_) |  | |   | |___  ___) | / ___ \\ | |_| |  / __/ | |_| || |  / /   \n";
		print "|____/   |_|    \\____||____/ /_/   \\_\\ \\____| |_____| \\___/ |_| /_/    \n";
		print "\n";
		print "Version fill input. Script By Ohm CSAG 2016. Modified by Komphet.me\n";
		print "\n";
		print "\n";
		print "[$time] Connection Reset!!!\n";
		if($message!=""){
			print $message;
			$message="";
		}
		if(login()==0){
			sleep 10;
			next;
		};
	}
	
	sleep 60;
	
}

sub login {
	if($username=="" || $username==""){
		print "Username: ";
		chomp ($username=<>);
		print "Password: ";
		ReadMode( "noecho");
		chomp ($password=<>);
		ReadMode ("original") ;
		print "\nChecking...\n";
	}
	$content=$agent->post('https://10.252.23.2:8445/PortalServer/Webauth/webAuthAction!login.action',[
		'userName' => $username,
		'password' => $password,
		'validCode' => '',
		'authLan' => 'en',
		'hasValidateNextUpdatePassword' => 'true',
		'browserFlag' => 'en',
		'ClientIp' => ''
	]);

	if($content->is_success){
		$check=$agent->get('http://188.166.177.132/check/');
		if($check->is_success){
			if($check->as_string=~/Hello planet!\n/){
				print " You are Loged in!\n\n";
				return 1;
			} else {
				$username="";
				$password="";
				$message="Username or Password is incorect!\n\n";
				print " Username or Password is incorect!\n\n";
				return 0;
			}
		}
	} else {
		print " Connection Error!\n\n";
		return 0;
	}
	
}

sub checkConnection {
	$check=$agent->get('http://188.166.177.132/check/');
		if($check->is_success){
			if($check->as_string=~/Hello planet!\n/){
				return 1;
			} else {
				return 0;
			}
		}
}
