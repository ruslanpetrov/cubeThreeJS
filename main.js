class ColorCube {

    constructor(container = '#webgl-container') {
        const {innerWidth, innerHeight} = window;
        this.defaults = {
            colors: [
                0xff0000,
                0x00ff00,
                0x0000ff,
                0xF7005B,
                0xffffff,
                0x2AFFF0,
                0xFFEF00,
                0x5DFF79
            ],
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(25, innerWidth / innerHeight, 0.1, 1000),
            renderer: new THREE.WebGLRenderer(),
            webGLContainer: document.querySelector(container),
            raycaster: new THREE.Raycaster(),
            mouse: new THREE.Vector2()
        };
        this.__proto__.render = this.render.bind(this);
    }

    init() {
        const {
            scene,
            camera
        } = this.defaults;
        const cube = this.createCubeWithEdges();
        this.setContainer();
        this.addVertices(cube);
        scene.add(cube);
        this.render();
        this.setControls();
        document.addEventListener('mousedown', this.mainInteraction.bind(this));
    }

    setContainer() {
        const {
            renderer,
            webGLContainer
        } = this.defaults;
        const {innerWidth, innerHeight} = window;
        renderer.setSize(innerWidth, innerHeight);
        webGLContainer.appendChild(renderer.domElement);
    }

    setControls() {
        const {
            renderer,
            camera
        } = this.defaults;
        new THREE.OrbitControls(camera, renderer.domElement);
    }

    createCubeWithEdges() {
        const cube = this.createCube();
        this.edges = this.setEdges(cube);
        cube.add(this.edges);
        return cube;
    }

    createCube() {
        const {camera} = this.defaults;
        const geometryWidth = 20;
        const geometryHeight = 20;
        const geometryDepth = 20;
        const geometry = new THREE.BoxGeometry(geometryWidth, geometryHeight, geometryDepth);
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 0
        });
        const cube = new THREE.Mesh(geometry, material);
        camera.position.z = 80;
        camera.position.x = 50;
        camera.position.y = 50;
        return cube;
    }

    setEdges(cube) {
        const edges = new THREE.EdgesHelper(cube, 0x0000ff);
        edges.material.linewidth = 5;
        return edges;
    }

    addVertices(cube) {
        const {
            scene,
            colors
        } = this.defaults;
        const {vertices} = cube.geometry;
        vertices.forEach((vertex, i) => {
            const vertexMaterial = new THREE.MeshBasicMaterial({
                color: colors[i]
            });
            const vertexSphere = new THREE.SphereGeometry(0.70);
            const vertexMesh = new THREE.Mesh(vertexSphere, vertexMaterial);
            const {x, y, z} = vertex;
            vertexMesh.position.x = x;
            vertexMesh.position.y = y;
            vertexMesh.position.z = z;
            scene.add(vertexMesh);
        });
    }

    mainInteraction(event) {
        const {
            mouse,
            scene,
            raycaster,
            renderer,
            camera
        } = this.defaults;
        mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
        mouse.y = - (event.clientY / renderer.domElement.height) * 2 + 1;
        this.setFromCamera(raycaster, mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        const {object} = intersects[0] || {};
        if (intersects.length && object.geometry.type === 'SphereGeometry') {
            const {color} = object.material;
            this.edges.material.color = color;
        }
    }

    setFromCamera(raycaster, coords, origin) {
        const {position} = origin;
        raycaster.ray.origin.copy(position);
        raycaster.ray.direction
            .set(coords.x, coords.y, 0.5)
            .unproject(origin)
            .sub(position)
            .normalize();
    }

    render() {
        const {
            renderer,
            scene,
            camera
        } = this.defaults;
        renderer.render(scene, camera);
        requestAnimationFrame(this.render);
    }

}

window.onload = () => {
    const cube = new ColorCube();
    cube.init();
};
//test
//2
