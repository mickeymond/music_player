new Vue({
	el: '#app',
	data: {
		fetchedSongs: [],
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
				//this.audioSrc = `./media/${this.selectedSong}.mp3`;
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
				var blob = new Blob(this.recordedAudio, {
	        'type': 'audio/ogg; codecs=opus'
	      });
	      var audioURL = window.URL.createObjectURL(blob);
	      //this.audioSrc = audioURL;
	      this.songs.push(audioURL);
	      this.recordedAudio = [];
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
				this.audioSrc = `./media/${this.selectedSong}.mp3`;
			}
		},
		next() {
			if(this.isPlaying == true) {
				var songsList = document.getElementById('songs');
				var selectedSong = songsList.selectedIndex;
				if(selectedSong < songsList.length) {
					this.selectedSong = songsList.options[selectedSong + 1].value;
				}
				this.audioSrc = `./media/${this.selectedSong}.mp3`;
			}
		},
		record() {
			let app = this;
			this.audioSrc = '';
			this.isPlaying = false;
			this.isRecording = true;
			this.mediaRecorder = new MediaRecorder(this.mediaStream);
			this.mediaRecorder.start(1000);
		  this.mediaRecorder.ondataavailable = function(e) {
		  	console.log(e);
			  app.recordedAudio.push(e.data);
			}
		}
	},
	mounted: function() {
		let app = this;
		var constraints = {audio:true};
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(mediaStream) {
		  app.mediaStream = mediaStream;
		})
		.catch(function(err) { console.log(err.name + ": " + err.message); });
	},
	watch: {
		selectedArtist: function() {},
		selectedGenre: function() {
			this.songs = [];
			for(var song of this.fetchedSongs) {
				if(song.genre === this.selectedGenre) {
					this.songs.push(song.title);
				}
			}
		}
	}
});