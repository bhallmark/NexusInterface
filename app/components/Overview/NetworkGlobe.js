/*
  Title: Network Globe
  Description: Creates the network globe for the overview.
  Last Modified by: Brian Smith
*/
// External Dependencies
import React, { Component } from 'react';

import maxmind from 'maxmind';
import Request from 'request';
import * as THREE from 'three';

// Internal Dependencies
import styles from './style.css';
import DAT from 'scripts/globe';
import * as RPC from 'scripts/rpc';
import configuration from 'api/configuration';

var glb;
var initializedWithData = false;

export default class NetworkGlobe extends Component {
  // React Method (Life cycle hook)
  componentDidMount() {
    this.props.handleOnLineRender(this.testRestartLines);
    this.props.handleOnRemoveOldPoints(this.RemoveOldPointsAndReDraw);
    this.props.handleOnAddData(this.updatePointsOnGlobe);
    this.props.handleRemoveAllPoints(this.removeAllPoints);
    const path = require('path');
    const globeseries = [['peers', []]];
    let geoiplookup = '';
    if (process.env.NODE_ENV === 'development') {
      geoiplookup = maxmind.openSync(
        path.join(__dirname, 'GeoLite2-City', 'GeoLite2-City.mmdb')
      );
    } else {
      geoiplookup = maxmind.openSync(
        path.join(
          configuration.GetAppResourceDir(),
          'GeoLite2-City',
          'GeoLite2-City.mmdb'
        )
      );
    }
    let myIP = '';
    let incomingPillarColor = this.props.pillarColor;
    let incomingArchColor = this.props.archColor;
    let globeOptions = {
      colorFn: function(x) {
        return new THREE.Color(incomingPillarColor);
      },
      colorArch: incomingArchColor,
      colorGlobe: this.props.globeColor,
    };
    glb = new DAT(this.threeRootElement, globeOptions);
    glb.animate();
    Request(
      {
        url: 'http://www.geoplugin.net/json.gp',
        json: true,
      },
      (error, response, body) => {
        // console.log(error, response, body)
        if (error) {
          console.log(error);
        } else {
          if (response !== undefined) {
            if (response.statusCode === 200) {
              RPC.PROMISE('getpeerinfo', []).then(payload => {
                var tmp = {};
                var ip = {};
                let maxnodestoadd = payload.length;
                if (maxnodestoadd > 20) {
                  maxnodestoadd = 20;
                }
                for (var i = 0; i < maxnodestoadd; i++) {
                  ip = payload[i].addr;
                  ip = ip.split(':')[0];
                  var tmp = geoiplookup.get(ip);
                  globeseries[0][1].push(tmp.location.latitude);
                  globeseries[0][1].push(tmp.location.longitude);
                  globeseries[0][1].push(0.1); //temporary magnitude.
                }

                globeseries[0][1].push(body['geoplugin_latitude']);
                globeseries[0][1].push(body['geoplugin_longitude']);
                globeseries[0][1].push(0.1); //temporary magnitude.

                //glb = new DAT(this.threeRootElement);
                glb.addData(globeseries[0][1], {
                  format: 'magnitude',
                  name: globeseries[0][0],
                });
                glb.createPoints();
                //  Start the animations on the globe
                initializedWithData = true;
                //glb.animate();
              });
            }
          }
        }
      }
    );
  }
  // React Method (Life cycle hook)
  componentWillUnmount() {
    this.threeRootElement.remove();
  }
  // Class Methods
  updatePointsOnGlobe() {

    console.log("start function");
    const globeseries = [['peers', []]];
    let geoiplookup = '';

    const path = require('path');
    if (process.env.NODE_ENV === 'development') {
      geoiplookup = maxmind.openSync(
        path.join(__dirname, 'GeoLite2-City', 'GeoLite2-City.mmdb')
      );
    } else {
      geoiplookup = maxmind.openSync(
        path.join(
          configuration.GetAppResourceDir(),
          'GeoLite2-City',
          'GeoLite2-City.mmdb'
        )
      );
    }
    let myIP = '';
    console.log("before request");
    Request(
      {
        url: 'http://www.geoplugin.net/json.gp',
        json: true,
      },
      (error, response, body) => {
        RPC.PROMISE('getpeerinfo', []).then(payload => {
          var tmp = {};
          var ip = {};
          let maxnodestoadd = payload.length;
          if (maxnodestoadd > 20) {
            maxnodestoadd = 20;
          }
          for (var i = 0; i < maxnodestoadd; i++) {
            ip = payload[i].addr;
            ip = ip.split(':')[0];
            var tmp = geoiplookup.get(ip);
            globeseries[0][1].push(tmp.location.latitude);
            globeseries[0][1].push(tmp.location.longitude);
            globeseries[0][1].push(0.1); //temporary magnitude.
          }

          if (response !== undefined){
            if (response.statusCode !== undefined && response.statusCode === 200)
            {
              globeseries[0][1].push(body['geoplugin_latitude']);
              globeseries[0][1].push(body['geoplugin_longitude']);
              globeseries[0][1].push(0.1); //temporary magnitude.
            }
          }
          else
          {
            globeseries[0][1].push(0);
            globeseries[0][1].push(0);
            globeseries[0][1].push(0.1); //temporary magnitude.
          }

          glb.removePoints();
          glb.addData(globeseries[0][1], {
            format: 'magnitude',
            name: globeseries[0][0],
          });
          glb.createPoints();
        });
          
        
      }
    );
  }

  testRestartLines() {
    if (glb != null && glb != undefined) {
      glb.playCurve();
    }
  }
  removeAllPoints() {
    if (glb == null || glb == undefined) {
      return;
    }
    glb.removePoints();
  }

  RemoveOldPointsAndReDraw() {
    if (glb == null || glb == undefined) {
      return;
    }

    glb.removePoints();
    //console.log("RemovedPoints");
    setTimeout(() => {
      glb.createPoints();
      //console.log("CreatedNewOnes");
    }, 1000);
  }

  getResourcesDirectory() {
    let appPath = require('electron').remote.app.getAppPath();

    if (process.cwd() === appPath) return './';
    else return process.resourcesPath + '/';
  }

  // Mandatory React method
  render() {
    return (
      <div id="nxs-earth" className="earth">
        <div ref={element => (this.threeRootElement = element)} />
      </div>
    );
  }
}
