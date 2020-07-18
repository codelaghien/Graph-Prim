const diameter = 80;
const fontSize = 45;
let mouseIsDragged = false;
let currentVertex = null;
let PrimIsRunning = false;
let buttonSelectStartVertex;
let selectingStartVertex = false;
let selectedStartVertex = null;
const MSTEdgeWeight = 10;
const MSTEdgeColor = 'red';
const MSTVertexColor = 'blue';
const INFINITY = -1;
let speedMS;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let buttonAddVertex;
let buttonAddEdge;
let buttonShowHideId;
let buttonSelectVertexA;
let buttonSelectVertexB;
let selectedVertexA = null;
let selectedVertexB = null;
let selectingVertexA = false;
let selectingVertexB = false;
let weightInput;
let buttonSave;
let buttonImport;
let inputTextArea;
const graph = new Graph(diameter, fontSize);

function setup() {
	width = windowWidth - 30;
	height = windowHeight - 30;
	createCanvas(width, height);

	buttonAddVertex = createButton('Thêm Vertex');
	buttonAddVertex.position(15, 20);
	buttonAddVertex.mousePressed(addVertex);

	buttonShowHideId = createButton('Show Hide Id');
	buttonShowHideId.position(15, 50);
	buttonShowHideId.mousePressed(showHideId);

	buttonSelectVertexA = createButton('Chọn Vertex 1: ?');
	buttonSelectVertexA.id('buttonSelectVertexA');
	buttonSelectVertexA.position(15, 80);
	buttonSelectVertexA.mousePressed(selectVertexA);

	weightInput = createInput('100');
	weightInput.size(70);
	weightInput.position(15, 110);

	buttonSelectVertexB = createButton('Chọn Vertex 2: ?');
	buttonSelectVertexB.id('buttonSelectVertexB');
	buttonSelectVertexB.position(15, 140);
	buttonSelectVertexB.mousePressed(selectVertexB);

	buttonAddEdge = createButton('Thêm Edge');
	buttonAddEdge.position(15, 170);
	buttonAddEdge.mousePressed(addEdge);

	let div = createDiv('');
	div.html('Tốc độ', true);
	div.position(15, 200);
	speedMS = createInput('3000');
	speedMS.size(50);
	speedMS.position(75, 200);

	buttonSelectStartVertex = createButton(
		"Prim's Algorithm: chọn Start Vertex"
	);
	buttonSelectStartVertex.id('buttonSelectStartVertex');
	buttonSelectStartVertex.position(15, 230);
	buttonSelectStartVertex.mousePressed(selectStartVertex);

	buttonSave = createButton('Save Image');
	buttonSave.position(15, 270);
	buttonSave.mousePressed(saveImage);

	buttonImport = createButton('Import Graph');
	buttonImport.position(110, 270);
	buttonImport.mousePressed(importGraph);

	inputTextArea = createElement('TextArea');
	inputTextArea.id('inputTextArea');
	inputTextArea.position(15, 300);
	inputTextArea.size(100, 200);
	document.getElementById('inputTextArea').innerText =
		'[{"id":0,"name":"A","x":221,"y":761,"edges":[{"vertexBId":1,"weight":3},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":6}]},{"id":1,"name":"B","x":399,"y":651,"edges":[{"vertexBId":0,"weight":3},{"vertexBId":2,"weight":2},{"vertexBId":4,"weight":9},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":4}]},{"id":2,"name":"C","x":488,"y":465,"edges":[{"vertexBId":1,"weight":2},{"vertexBId":3,"weight":2},{"vertexBId":6,"weight":9},{"vertexBId":4,"weight":8}]},{"id":3,"name":"D","x":416,"y":304,"edges":[{"vertexBId":0,"weight":6},{"vertexBId":1,"weight":4},{"vertexBId":2,"weight":2},{"vertexBId":6,"weight":9}]},{"id":4,"name":"E","x":885,"y":620,"edges":[{"vertexBId":1,"weight":9},{"vertexBId":2,"weight":8},{"vertexBId":5,"weight":8},{"vertexBId":6,"weight":7},{"vertexBId":8,"weight":9},{"vertexBId":9,"weight":10}]},{"id":5,"name":"F","x":768,"y":1005,"edges":[{"vertexBId":0,"weight":9},{"vertexBId":1,"weight":9},{"vertexBId":4,"weight":8},{"vertexBId":9,"weight":18}]},{"id":6,"name":"G","x":881,"y":166,"edges":[{"vertexBId":2,"weight":9},{"vertexBId":3,"weight":9},{"vertexBId":4,"weight":7},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":5}]},{"id":7,"name":"H","x":1142,"y":108,"edges":[{"vertexBId":6,"weight":4},{"vertexBId":8,"weight":1},{"vertexBId":9,"weight":4}]},{"id":8,"name":"I","x":1263,"y":234,"edges":[{"vertexBId":4,"weight":9},{"vertexBId":6,"weight":5},{"vertexBId":7,"weight":1},{"vertexBId":9,"weight":3}]},{"id":9,"name":"J","x":1520,"y":243,"edges":[{"vertexBId":4,"weight":10},{"vertexBId":5,"weight":18},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":3}]}]';
}

function draw() {
	background(255);
	graph.draw();
	noLoop();
}

function addVertex() {
	graph.addVertex();
	loop();
}

function addEdge() {
	if (
		selectedVertexA &&
		selectedVertexB &&
		selectedVertexA.id !== selectedVertexB.id &&
		+weightInput.value() >= 0
	) {
		graph.connect(
			selectedVertexA.id,
			selectedVertexB.id,
			+weightInput.value(),
			'white',
			'blue',
			'white',
			'blue',
			'black',
			1
		);
		selectingVertexA = false;
		selectingVertexB = false;
		document.getElementById('buttonSelectVertexA').style.background =
			'white';
		document.getElementById('buttonSelectVertexB').style.background =
			'white';
		document.getElementById('buttonSelectVertexA').innerText =
			'Click Vertex 1';
		document.getElementById('buttonSelectVertexB').innerText =
			'Click Vertex2';
		loop();
	}
}

function selectStartVertex() {
	selectingStartVertex = true;
	selectingVertexA = false;
	selectingVertexB = false;
	document.getElementById('buttonSelectStartVertex').style.background =
		'yellow';
	document.getElementById('buttonSelectVertexA').innerText =
		'Chọn Vertex 1: ?';
	document.getElementById('buttonSelectVertexB').innerText =
		'Chọn Vertex 2: ?';
	document.getElementById('buttonSelectVertexA').style.background = 'white';
	document.getElementById('buttonSelectVertexB').style.background = 'white';
}

async function PrimMST() {
	if (!selectedStartVertex) return;

	graph.reset();
	loop();

	let MSTEdges = [];
	let neighborhood = [];
	for (let edge of selectedStartVertex.edges) {
		neighborhood.push(edge);
		graph.connect(
			edge.vertexA.id,
			edge.vertexB.id,
			edge.weight,
			'white',
			'magenta',
			'white',
			'magenta',
			'magenta',
			MSTEdgeWeight / 2
		);
	}
	neighborhood.sort(function (a, b) {
		return +b.weight - +a.weight;
	});
	let t = 0;
	while (
		MSTEdges.length < graph.vertices.length &&
		neighborhood.length > 0 &&
		t++ < 30
	) {
		let newEdge = neighborhood.pop();
		while (neighborhood.length > 0 && newEdge.vertexB.mst) {
			newEdge = neighborhood.pop();
		}
		if (newEdge.vertexA.mst && newEdge.vertexB.mst) {
			break;
		}
		MSTEdges.push(newEdge);

		graph.connect(
			newEdge.vertexA.id,
			newEdge.vertexB.id,
			newEdge.weight,
			'white',
			MSTVertexColor,
			'white',
			MSTVertexColor,
			MSTEdgeColor,
			MSTEdgeWeight
		);
		newEdge.vertexA.mst = true;
		newEdge.vertexB.mst = true;
		loop();
		await delay(speedMS.value());
		for (let edge of newEdge.vertexB.edges) {
			if (!edge.vertexB.mst) {
				graph.connect(
					edge.vertexA.id,
					edge.vertexB.id,
					edge.weight,
					edge.vertexA.color,
					edge.vertexA.background,
					'white',
					'magenta',
					'magenta',
					MSTEdgeWeight / 2
				);
				if (
					edge.vertexB.mstWeight == INFINITY ||
					edge.weight < edge.vertexB.mstWeight
				) {
					edge.vertexB.mstWeight = edge.weight;
				}
				neighborhood.push(edge);
			}
		}
		neighborhood.sort(function (a, b) {
			return +b.weight - +a.weight;
		});
		neighborhood = neighborhood.filter((edge) => {
			if (edge.vertexA.mst && edge.vertexB.mst) {
				graph.connect(
					edge.vertexA.id,
					edge.vertexB.id,
					edge.weight,
					edge.vertexA.color,
					edge.vertexA.background,
					edge.vertexB.color,
					edge.vertexB.background,
					'gray',
					0.4
				);
			}
			return !edge.vertexA.mst || !edge.vertexB.mst;
		});
		if (neighborhood.length > 0) {
			const edge = neighborhood[neighborhood.length - 1];
			graph.connect(
				edge.vertexA.id,
				edge.vertexB.id,
				edge.weight,
				edge.vertexA.color,
				edge.vertexA.background,
				edge.vertexB.color,
				edge.vertexB.background,
				'green',
				MSTEdgeWeight
			);
			loop();
			await delay(speedMS.value());
		}
	}
	loop();

	let mst = [];
	let totalWeight = 0;
	console.log('MSTEdges', MSTEdges);
	for (let edge of MSTEdges) {
		totalWeight += edge.weight;
		console.log(
			edge.vertexA.name + ' to ' + edge.vertexB.name + ': ' + edge.weight
		);
	}
	console.log('Total weight = ' + totalWeight);
}

function selectVertexA() {
	selectingVertexA = true;
	document.getElementById('buttonSelectVertexA').style.background = 'yellow';
	document.getElementById('buttonSelectVertexA').innerText =
		'Click 1 vertex để chọn';
	selectingVertexB = false;
	document.getElementById('buttonSelectVertexB').style.background = 'white';
}

function selectVertexB() {
	selectingVertexA = false;
	document.getElementById('buttonSelectVertexA').style.background = 'white';
	selectingVertexB = true;
	document.getElementById('buttonSelectVertexB').style.background = 'yellow';
	document.getElementById('buttonSelectVertexB').innerText =
		'Click 1 vertex để chọn';
}

function showHideId() {
	Vertex.showHideId();
	loop();
}

function importGraph() {
	const data = inputTextArea.value();
	if (data) {
		const obj = JSON.parse(data);
		graph.clear();
		obj.forEach((vertex) => {
			graph.importVertex(
				new Vertex(vertex.x, vertex.y, diameter, fontSize)
			);
		});
		obj.forEach((vertex) => {
			for (let edge of vertex.edges) {
				graph.connect(
					vertex.id,
					edge.vertexBId,
					edge.weight,
					'blue',
					'black',
					'blue',
					'black',
					'black',
					1
				);
			}
		});
		loop();
	}
	PrimIsRunning = false;
	currentVertex = null;
}

function saveImage() {
	inputTextArea.value(graph.export());
	saveCanvas('MyGraph', 'png');
	console.log('save', inputTextArea.value());
	saveStrings(inputTextArea.value().split('\n'), 'MyGraph.txt');
}

function findSelectVertex() {
	currentVertex = graph.findSelectedVertex();
	loop();
}

function mousePressed() {
	if (PrimIsRunning) return;
	mouseIsDragged = false;
	findSelectVertex();
}

function mouseClicked() {
	if (PrimIsRunning) return;

	mouseIsDragged = false;
	findSelectVertex();
	if (currentVertex) {
		if (selectingVertexA) {
			selectedVertexA = currentVertex;
			document.getElementById('buttonSelectVertexA').innerText =
				'Chọn Vertex 1 => ' + selectedVertexA.name;
			document.getElementById('buttonSelectVertexA').style.background =
				'white';
		} else if (selectingVertexB) {
			selectedVertexB = currentVertex;
			document.getElementById('buttonSelectVertexB').innerText =
				'Chọn Vertex 2 => ' + selectedVertexB.name;
			document.getElementById('buttonSelectVertexB').style.background =
				'white';
		} else if (selectingStartVertex) {
			selectedStartVertex = currentVertex;
			PrimIsRunning = true;
			document.getElementById('buttonSelectStartVertex').innerText =
				"Prim's Algorithm: Start Vertex = " + selectedStartVertex.name;
			document.getElementById(
				'buttonSelectStartVertex'
			).style.background = 'yellow';
			PrimMST();
		}
	}
}

function mouseDragged() {
	if (PrimIsRunning) return;
	mouseIsDragged = true;
	if (currentVertex) {
		currentVertex.x = mouseX;
		currentVertex.y = mouseY;
		loop();
	}
	return false;
}

function mouseReleased() {
	if (PrimIsRunning) return;
	if (mouseIsDragged && currentVertex) {
		currentVertex.x = mouseX;
		currentVertex.y = mouseY;
		currentVertex = null;
		loop();
	}
	mouseIsDragged = false;
	return false;
}
