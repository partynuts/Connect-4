var column = $( ".column" );

var showPlayer = $( "#player" );
var curPlayer = "Player1";
var chip = $( ".chip1" );
var prevPlayer;
showPlayer.html( `It is ${curPlayer}'s turn!` );
console.log( curPlayer );
console.log( column.length );

function switchPlayer() {
	if ( curPlayer == "Player1" ) {
		curPlayer = "Player2";
		prevPlayer = "Player1";
		chip.removeClass( "chip1" ).addClass( "chip2" );
		showPlayer.html( `It is ${curPlayer}'s turn!` );
	} else {
		curPlayer = "Player1";
		prevPlayer = "Player2";
		chip.removeClass( "chip2" ).addClass( "chip1" );
		showPlayer.html( `It is ${curPlayer}'s turn!` );
	}
	console.log( curPlayer );
}

function checkForVic( field ) {
	var connection = "";
	for ( var i = 0; i < field.length; i++ ) {
		if ( field.eq( i ).hasClass( curPlayer ) ) {
			connection += "y";
		} else {
			connection += "n";
		}
	}
	console.log( connection );
	if ( connection.includes( "yyyy" ) ) {
		for ( var i = 0; i < field.length; i++ ) {
			if ( field.eq( i ).hasClass( curPlayer ) ) {
				field.eq( i ).addClass( "highlight" );
			}
		}
		return true;
	}
}

function checkSlotDiag( col, row ) {

	var slots = $( ".column" )
		.eq( col - 3 )
		.children()
		.eq( row - 3 );
	slots = slots.add(
		$( ".column" )
		.eq( col - 2 )
		.children()
		.eq( row - 2 )
	);
	slots = slots.add(
		$( ".column" )
		.eq( col - 1 )
		.children()
		.eq( row - 1 )
	);
	slots = slots.add(
		$( ".column" )
		.eq( col )
		.children()
		.eq( row )
	);
	slots = slots.add(
		$( ".column" )
		.eq( col + 1 )
		.children()
		.eq( row + 1 )
	);
	slots = slots.add(
		$( ".column" )
		.eq( col + 2 )
		.children()
		.eq( row + 2 )
	);
	slots = slots.add(
		$( ".column" )
		.eq( col + 3 )
		.children()
		.eq( row + 3 )
	);
	console.log( checkForVic( slots ), slots, 1 );
	if ( checkForVic( slots ) ) {
		return true;
	} else {
		//check diag upright
		slots = $( ".column" )
			.eq( col - 3 )
			.children()
			.eq( row + 3 );
		slots = slots.add(
			$( ".column" )
			.eq( col - 2 )
			.children()
			.eq( row + 2 )
		);
		slots = slots.add(
			$( ".column" )
			.eq( col - 1 )
			.children()
			.eq( row + 1 )
		);
		slots = slots.add(
			$( ".column" )
			.eq( col )
			.children()
			.eq( row )
		);
		slots = slots.add(
			$( ".column" )
			.eq( col + 1 )
			.children()
			.eq( row - 1 )
		);
		slots = slots.add(
			$( ".column" )
			.eq( col + 2 )
			.children()
			.eq( row - 2 )
		);
		slots = slots.add(
			$( ".column" )
			.eq( col + 3 )
			.children()
			.eq( row - 3 )
		);
		console.log( checkForVic( slots ), slots, 2 );
		return checkForVic( slots );
	}
	var str1 = "";
	for ( var i = 0; i < 7; i++ ) {
		if ( slots[ i ].hasClass( curPlayer ) ) {
			str1 += "y";
		} else {
			str1 += "n";
		}
	}

	if ( str1.includes( "yyyy" ) ) {
		for ( var i = 0; i < 7; i++ ) {
			if ( slots[ i ].hasClass( curPlayer ) ) {
				slots[ i ].addClass( "highlight" );
			}
		}
		return true;
	}

}

column.on( "click", function( e ) {
	var overlay = $( "#overlay" );
	var slotsInColumn = $( e.currentTarget ).find( ".slot" );
	console.log( slotsInColumn );
	for ( var i = 5; i >= 0; i-- ) {
		if ( !slotsInColumn.eq( i ).hasClass( "Player1" ) &&
			!slotsInColumn.eq( i ).hasClass( "Player2" )
		) {
			slotsInColumn.eq( i ).addClass( curPlayer );
			break;
		}
	}
	if ( checkForVic( slotsInColumn ) ) {
		var vicmess = $( ".vicmessage" );
		var vicText = $( "#one" );
		//vic message for winning in column
		setTimeout( function vicPopup() {
			overlay.css( "display", "block" );
			vicText.html( curPlayer + " wins! Congrats!!" );
			vicmess.css( {
				left: "20%",
				display: "block"
			} );
		}, 700 );

		( function() {
			vicmess.on( "click", function() {
				overlay.css( "display", "none" );
				location.reload();
			} );
			overlay.on( "click", function() {
				overlay.css( "display", "none" );
				location.reload();
			} );
		} )();

		console.log( "You won with 4 in a column!" );

		return;
	} else {
		var slotsInRow = $( ".row" + i );
		var vicTextRow = $( ".anim" );
		console.log( slotsInRow );
		//vic message for winning in row
		if ( checkForVic( slotsInRow ) ) {
			var lok = $( "#lok" );
			var overlaygalaxy = $( ".overlaygalaxy" );
			setTimeout( function vicPopup() {
				( function runlock() {
					var animation;

					vicTextRow.html( prevPlayer + " wins! Congrats!" );
					lok.css( "visibility", "visible" );
					overlaygalaxy.css( "display", "block" );
					lok.animate( {
						left: "100px",
						bottom: "300px"
					}, "slow" );
					animation = requestAnimationFrame( runlock );
				} )();
			}, 700 );
			( function() {
				lok.on( "click", function() {
					overlaygalaxy.css( "display", "none" );
					location.reload();
				} );
				overlaygalaxy.on( "click", function() {
					overlaygalaxy.css( "display", "none" );
					location.reload();
				} );
			} )();
		} else {
			//vic message for winning diagonally
			if ( checkSlotDiag( $( e.currentTarget ).index(), i ) ) {
				var flipBox = $( ".box.flipbox" );
				var vicTextDiag = $( ".text.animated.flip" );
				setTimeout( function vicPopup() {
					( function flipText() {
						vicTextDiag.html( prevPlayer + " wins! Yippie!!" );
						overlay.css( "display", "block" );
						flipBox.css( {
							left: "35%",
							display: "block"
						} );
					} )();
					( function() {
						flipBox.on( "click", function() {
							overlay.css( "display", "none" );
							location.reload();
						} );
						overlay.on( "click", function() {
							overlay.css( "display", "none" );
							location.reload();
						} );
					} )();
				}, 700 );
			}
			// else {
			//     (function checkIfFull() {
			//         var cell = $(".slot");
			//         var full = true;
			//         var gameOverTxt = $(".gameOverTxt");
			//          // check if all fields are filled with a chip
			//         for (var i = 0; i < cell.length; i++) {
			//             if (cell.eq(i).hasClass("")) {
			//                 full = false;
			//             } else {
			//                 setTimeout(function gameOver() {
			//                     overlay.css("display", "block");
			//                     gameOverTxt.html("No winner!");
			//                     gameOverTxt.css({
			//                         left: "20%",
			//                         display: "block"
			//                     });
			//                 }, 500);
			//
			//                 (function() {
			//                     gameOverTxt.on("click", function() {
			//                         overlay.css("display", "none");
			//                         location.reload();
			//                     }); // When the user clicks on img, reload
			//                     overlay.on("click", function() {
			//                         overlay.css("display", "none");
			//                         location.reload();
			//                     });
			//                 })();
			//             }
			//         }
			//     });
			// }
		}

		switchPlayer();
	}
} );

( function chipMove() {
	var chip = $( ".chip" );
	var center = chip.offsetWidth / 2;
	var board = $( ".board" );

	chip.on( "mousemove", function( e ) {

		chip.style.left = e.x - center + "px";
		chip.style.top = e.y - center + "px";
		console.log( chip );

	} );
} )();