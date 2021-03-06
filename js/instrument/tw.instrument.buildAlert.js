/*
 {
 "instrument":"buildalert",
 "width":"300",
 "height":"300",
 "id":"buildalert",
 "url":"data/buildalert.json"
 }
 */
teamwall.instrument.buildAlert = function (configuration) {

  function BuildAlertInstrument(configuration) {

    var instrumentConfiguration = configuration;

    this.getConfiguration = function () {
      return instrumentConfiguration;
    };

    this.setValue = function (newValue) {
      drawInstrument(newValue);
    };

    function drawInstrument(value) {

      var canvas = document.getElementById(instrumentConfiguration.id);
      var context = canvas.getContext("2d");
      context.font = teamwall.render.fontForHeader(canvas);
      context.textBaseline = "middle";
      context.textAlign = "center";
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      var failedBuilds = [];

      var numberOfBuildChains = value.length;
      if (0 < numberOfBuildChains) {
        jQuery.each(value, function () {
          var buildChain = this;
          console.log(buildChain.name);
          jQuery.each(buildChain.chain, function () {
            var buildChainPart = this;
            console.log(buildChainPart.status);
            if (buildChainPart.status != "SUCCESS") {
              failedBuilds.push({"chain": buildChain, "part": buildChainPart});
            }
          });

        });
        console.log("# FAILED BUILDS " + failedBuilds.length);
        teamwall.render.writeText(context, "Builds", centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);

        if (0 < failedBuilds.length) {
          context.fillStyle = teamwall.configuration.colorFailure;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = teamwall.configuration.colorText;
          var heightOfOneBlock = canvas.height / failedBuilds.length;
          var part = 0;
          jQuery.each(failedBuilds, function () {
            var failedBuild = this;
            context.fillText(failedBuild.chain.name + " " + failedBuild.part.name, centerX, part * heightOfOneBlock + (heightOfOneBlock / 2), canvas.width);
            part++;
          });
        }
        else {
          context.fillStyle = teamwall.configuration.colorOk;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = teamwall.configuration.colorText;
          context.fillText("We're good.", centerX, centerY, canvas.width);

        }

      }
      else {
        console.log("Can not display BuildChain <=0 ");
      }
    }
  }

  return new BuildAlertInstrument(configuration)
};