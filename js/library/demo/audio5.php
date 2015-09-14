<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>audio5.js</title>
</head>
<body>
<button id="play-pause" type="button">Play / Pause</button>
<button id="move-to-start" type="button">Move to Start</button>
  <script type="text/javascript" src="../audio5js/audio5.js"></script>
<script>
  var audioReady = function () {
    this.on('ended', function(){console.log('ended')})
    this.load('./music/mother.mp3');
    var play_pause = document.getElementById('play-pause');
    play_pause.addEventListener('click', playPause.bind(this));
    var move_to_start = document.getElementById('move-to-start');
  }

  var playPause = function () {
    console.log(this.position, this.duration, this.load_percent, this.volume());
    if (this.playing) {
      this.pause();
      this.volume(0);
      
    } else {
      this.play();
      this.volume(1);
    }
  }

  function initAudio () {
    var audio5js = new Audio5js({
      ready: audioReady
    });
  }
  initAudio();
</script>
</body>
</html>