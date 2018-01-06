new Vue({
	el: '#app',
	data: {
		genres: [],
		artists: [],
		songs: [],
		selectedGenre: '',
		selectedArtist: '',
		selectedSong: '',
		audioSrc: '',
		isRecording: false,
		isPlaying: false,
		recordedAudio: []

	},
	methods: {
		play() {
			if(this.selectedSong != '') {
				this.audioSrc = this.selectedSong;
				this.isPlaying = true;
			}
		},
		pause() {
			if(this.isPlaying == true) {
				var music = document.getElementById('music');
				if(music.paused) {
					music.play();
				} else {
					music.pause();
				}
			}
		},
		stop() {
			if(this.isRecording == true) {
				this.isRecording = false;
				this.mediaRecorder.stop();
				var file = new Blob(this.recordedAudio, {
	        'type': 'audio/ogg; codecs=opus'
	      });
	      var fileName = prompt('Name your file');
	      firebase.storage().ref(`/songs/${fileName}.ogg`).put(file)
	      .then(snapshot => {
	      	firebase.database().ref(`/songs`).push({
	      		fileName: fileName,
	      		fileUrl: snapshot.downloadURL
	      	}).then(() => alert('File upload was successful'));
	      });
	    } else if(this.isPlaying == true) {
	    	this.audioSrc = '';
	    	this.isPlaying = false;
	    }
		},
		previous() {
			if(this.isPlaying == true) {
				var songsList = document.getElementById('songs');
				var selectedSong = songsList.selectedIndex;
				if(selectedSong < songsList.length) {
					this.selectedSong = songsList.options[selectedSong - 1].value;
				}
				this.audioSrc = this.selectedSong;
			}
		},
		next() {
			if(this.isPlaying == true) {
				var songsList = document.getElementById('songs');
				var selectedSong = songsList.selectedIndex;
				if(selectedSong < songsList.length) {
					this.selectedSong = songsList.options[selectedSong + 1].value;
				}
				this.audioSrc = this.selectedSong;
			}
		},
		record() {
			let app = this;
			this.audioSrc = '';
			this.isPlaying = false;
			this.isRecording = true;
			this.recordedAudio = [];
			var mediaRecorder = new MediaRecorder(this.mediaStream);
			this.mediaRecorder = mediaRecorder;
			mediaRecorder.start(1000);
		  mediaRecorder.ondataavailable = function(e) {
			  app.recordedAudio.push(e.data);
			}
		}
	},
	mounted: function() {
		let app = this;
		this.fetchSongs;
		var constraints = {audio:true};
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(mediaStream) {
		  app.mediaStream = mediaStream;
		})
		.catch(function(err) { console.log(err.name + ": " + err.message); });
		console.log(this);
	},
	computed: {
		fetchSongs() {
			let app = this;
			firebase.database().ref('/songs').on('value', snapshot => {
				var songs = snapshot.val();
				app.songs = [];
				for(let song in songs) {
					app.songs.push(songs[song]);
				}
			});
		}
	},
	watch: {
		selectedSong: function() {
			console.log(this.selectedSong);
		}
	}
});