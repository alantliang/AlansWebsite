$(document).ready(function() {
	//http://api.jquery.com/jquery.ajax/
	$.ajax({
		url: '/steamgamesdata',
		dataType: 'json',
		// was another word besides complete...maybe data?
		success: function(data) {
			steamgames = data.response.games;
			gamesPlayed = [];
			for (var i = 0; i < steamgames.length; i++) {
				if (parseInt(steamgames[i].playtime_forever) > 0) {
					gamesPlayed.push({name: steamgames[i].name, playtime: parseInt(steamgames[i].playtime_forever)});
				}
			}
			gamesPlayed = gamesPlayed.sort(function(a, b) {return b.playtime - a.playtime}); //reverse descending
			for (var i = 0; i < gamesPlayed.length; i ++) {
				console.log(gamesPlayed[i]);
			}
		},
		error: function(data) {
			alert("we had an error")
		}
	});
});

// we need to format data to the way d3 wants it
function formatData(steamdata) {
	alert("formatting...");
	console.log(steamdata);
	if (steamdata) {
		for (var i; i < steamdata.games.length; i++) {
			if (steamdata.games[i].playtime_forever > 0) {
				console.log(steamdata.games[i].name);
			}
		}
	}
}

function graph(steamdata) {
	var diameter = 960,
		format = d3.format(",d"),
		color = d3.scale.category20c();

	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5);

	var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

	d3.json(steamdata, function(error, root) {
		var node = svg.selectAll(".node")
			.data(bubble.nodes(classes(root))
				.filter(function(d) {
					return !d.children;
				}))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node.append("title")
			.text(function(d) {
				return d.className + ": " + format(d.value);
			});

		node.append("circle")
			.attr("r", function(d) {
				return d.r;
			})
			.style("fill", function(d) {
				return color(d.packageName);
			});

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.className.substring(0, d.r / 3);
			});
	});

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	function classes(root) {
		var classes = [];

		function recurse(name, node) {
			if (node.children) node.children.forEach(function(child) {
				recurse(node.name, child);
			});
			else classes.push({
				packageName: name,
				className: node.name,
				value: node.size
			});
		}

		recurse(null, root);
		return {
			children: classes
		};
	}

	d3.select(self.frameElement).style("height", diameter + "px");
}