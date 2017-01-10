var	SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	FLOOR = -250,
	container = document.getElementById( 'container' ),
	stats = Stats(),
	camera = camera(),
	scene = scene(),
	sceneAnimationClip,
	renderer = renderer(),
	mesh,
	helper,
	mixer,
	mouseX = 0,
	mouseY = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,
	clock = new THREE.Clock()
;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

	scene.add( shaders() );

	scene.add( ground() );

	container.appendChild( renderer.domElement );

	container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize, false );

}

function scene() {

	var scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0xffffff, 2000, 10000 );

	return scene;

}

function camera() {

	var	camera = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 150;

	return camera;

}

function renderer() {

	var	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;

	return renderer;

}

function shaders() {

	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() },
		u_mouse: { type: "v2", value: new THREE.Vector2() }
	};

	var	material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	});

	var mesh = new THREE.Mesh( geometry, material );

	return mesh;

}

function ground() {

	var	geometry = new THREE.PlaneBufferGeometry( 16000, 16000 ),
		material = new THREE.MeshPhongMaterial( { emissive: 0x82EA0F } ),
		ground = new THREE.Mesh( geometry, material )
	;

	ground.position.set( 0, FLOOR, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;

	return ground;

}

function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;

	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX );

	mouseY = ( event.clientY - windowHalfY );

}

function render() {

	var delta = 0.75 * clock.getDelta();

	camera.position.x += ( mouseX - camera.position.x ) * .05;

	camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );

	camera.lookAt( scene.position );

	if ( mixer ) {

		//console.log( "updating mixer by " + delta );

		mixer.update( delta );

	}
	renderer.render( scene, camera );

}