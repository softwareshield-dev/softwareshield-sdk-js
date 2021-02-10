/**
*  Javascript wrapper for GameShield Core. (www.gameshield.com)
*
*  Created on	: 2010-10-13
*
*  History:
*
*   (*) v1.0.17 (Mar. 29, 2016)
*       adds new api: bool gs.core.isAppPublished();
*
*   (*) v1.0.16 (Mar. 19, 2016)
*       adds new property: bool gs.ui.inAppPurchase;
*       adds new helper function: gs.ui.purchase();
*
*   (*) v1.0.15 (Mar. 8, 2016)
*       adds new api:  gs.os.keyboard.isModifierKeyPressed(key);
*
*   (*) v1.0.14 (Feb 9, 2016)
*       adds new api helpers: entity.getTimeLeft()/getTimeLeftString()
*
*   (*) v1.0.13 (June 18, 2015)
*       adds new api: gs.app.buyNowURL
*
*   (*) v1.0.12 (June 3, 2015)
*      (1) adds new apis:
           gs.ui.setTitle( title );

           entity.lock();         

*   (*) v1.0.11.0 (Apr. 21, 2015)
*    (1) adds new api:  
          gs.core.applyLicenseCodeEx(code, sn, snRef); 
          
          gs.core.revokeApp() / gs.core.revokeSN();
		  
          gs.os.clipboard.copy(), gs.os.clipboard.paste()
          
          gs.os.locale.launguage/country/BCP47Name

	 (2) gs.util.launchDefaultBrowser supports mailto protocol;
	     adds helper api: gs.util.mailTo();
*
*   (*) v1.0.10.0 (Jan. 28, 2015)
*     adds new api:   gs.ui.loadTimeOut() / gs.ui.setLoadTimeOut() / gs.ui.unloadTimeOut() / gs.ui.setUnloadTimeOut() / gs.ui.render()
*
*   (*) v1.0.9.0 (May 08, 2014)
*     adds new api:
*       bool gs.core.isAppFirstLaunched();
*
*   (*) v1.0.8.1 (Mar 1st, 2014)
*     (1) deprecates token-based GS4 support;
*     (2) deprecates javascript side event handler management;
*     (3) returns null for (0 == native handle) in _createVar / _createParam / _createAction /_createRequest /_createLicense /_createEntity
*
*   (*) v1.0.8.0 (Feb 18, 2014)
*     + gs.core.isOnlineActivationPreferred()
*       returns true if the IDE specifies the activation method is "Online", false for "Manual" activation.
*
*   (*) v1.0.7.0 (Oct 15, 2013)
*     + adds new api:
*
*       string gs.core.getUniqueNodeId(); 
*   
*       This api returns unique hardware-based string that can be used as a consistent identifier of the client machine. 
*
*   (*) v1.0.6.1 (July 22, 2013)
*   	- fix getEntityDescription() issue. [JIRA (IW-56)] 
*
*   (*) v1.0.6 (July 16, 2013)
*   	+ Adds Entity attribute helper functions:
*   		bool entity.isLocked();
*   		bool entity.isAutoStart();
*
*   (*) v1.0.5 (July 2, 2013)
*       + Adds new action ACT_REVOKE (20) with two string property "sn" and "receipt";
*       + Adds new api:
*           string gs.core.revoke();
*           
*           It invalidates the local application and returns a non-empty string receipt on success, empty string on failure.  
*
*   (*) v1.0.4 (Apr. 21,2013)
*       + Adds new actions ACT_ONE_SHOT (17)/ACT_SHELF_TIME (18)/ACT_FP_FIX (19: Fixing FingerPrint)
*
*   (*) v1.0.3 (Apr. 3, 2013)
*   	+ Adds environment variable access:   gs.os.getEnvironmentVariable( varName )
*
*   	Ex:
*   	   var path = gs.os.getEnvironmentVariable("PATH");
*
*   	+ Adds file / dir access:
*   	   - string gs.os.homeDir
*   	   
*   	   - bool gs.os.fileExists( dir )
*   	   - string gs.os.readTextFile( file )
*   	   - bool gs.os.writeTextFile( file, content )
*
* 	   - bool gs.os.dirExists( dir )
* 	   - bool gs.os.createDir( dir )
* 	
* 	COMMENT:   
* 	   - All dir/file parameters, if given in relative path format, its full path is resolved against current user's home directory.
*	   - createDir() / writeTextFile() will create all immediate directories as necessary.
*
*   (*) v1.0.2 (Mar. 15, 2013)
*       Adds user defined event posting
*       Ex:
*          gs.app.sendUserEvent(gs.app.GS_USER_EVENT+1, "Hello World!"); 
*
*   (+) v1.0.1 ( Dec. 16, 2012 )
*   	Adds two properties: 
*   	 string gs.os.name
*   	 	Current Operating System Name.
*
*		Returns: "Windows", "Mac" or "Linux"
*
*   	 string[] gs.os.commandLineArgs
*   	 	Command Line Arguments of startup game exe
*		
*		Ex:
*			var args = gs.os.commandLineArgs;
*
*			args.length ==> argc
*			args[i]	    ==> argv[i]   (0 <= i < argc)
*
*
*   (+) v1.0.0 ( Dec. 12, 2012 )
*      Adds gs.core.isDebugVersion(), gs.core.trace(msg);
*
*   (+) March 30, 2012
*	Adds gs.core.createRequest().addActionEx(actId, entity, license);
*
*   (+) March 19, 2012
*   	Adds Phonon-based Video Render (gs.video.*) 
*
*/


/** Randy: For GS5/PC support

if(navigator.userAgent.indexOf('Mac') > 0)
{
*/

var gs = function () {
  //Variable access ( a lite version of core::_createParam)
  var _createVar = function(h) {
    if (h === 0) return null;
    return {
      //value
      getValue: function(){ 
        return _gs.getParamValue(h); 
      },
      setValue: function(val){ return _gs.setParamValue(h, val); }   
    }
  }

  return {
    //Plain readonly properties
    version : _gs.version,
    productName: _gs.productName,
    productId : _gs.productId,
    buildId: _gs.buildId,
    
    debugMsg: function(msg){
      _gs.debugMsg(msg);
    },

    ui: {
      //LMApp Location Constants
      LOC_LOCAL: 0,  //Use local lmApp version
      LOC_REMOTE: 1, //Use remote lmApp version
      LOC_AUTO: 2, //Select lmApp according to its settings in lmapp.config


      remoteUrlBase: _gs.ui_getRemoteUrlBase(),
      localDir: _gs.app_getLMAppPath(),

      //SDK 3.5.6+
      inAppPurchase: _gs.ui_inAppPurchase ? _gs.ui_inAppPurchase() : false,
      
      purchase: function(){
        if(this.inAppPurchase){ window.location = gs.app.buyNowURL; }
        else { gs.util.launchDefaultBrowser(gs.app.buyNowURL); };
      },

      close: function(rc){
        _gs.ui_close(rc);
      },
      open: function(url, title, autosize, width, height){
         _gs.ui_open(url, title, autosize, width, height);
      },

      loadTimeOut: function(){
        return _gs.ui_getLoadTimeOut();
      },
      setLoadTimeOut: function(maxTimeOutInSeconds){
        _gs.ui_setLoadTimeOut(maxTimeOutInSeconds);
      },

      unloadTimeOut: function(){
        return _gs.ui_getUnloadTimeOut();
      },
      setUnloadTimeOut: function(maxTimeOutInSeconds){
        _gs.ui_setUnloadTimeOut(maxTimeOutInSeconds);
      },

      /*
       * Render URL
       *
       * Example:  
       *  render('unlock.htm'); //try loading local file 'AppDir/UI_HTML/unlock.htm' or 'AppDir/unlock.htm'
       *  render('unlock.htm', {location: gs.ui.LOC_REMOTE});  //try loading remote file  'remoteUrl/unlock.htm' 
       *
       *  render('unlock.htm', { title: 'My Title' }); //render with 5 seconds maximum timeout, with a title. 
       */
      render: function(url, opt){
        var renderOpt = typeof opt !== 'undefined' ? opt : {};
        var title = typeof renderOpt.title !== 'undefined' ? renderOpt.title : _gs.productName; //default tile: productName
        var autosize = typeof renderOpt.autosize !== 'undefined' ? renderOpt.autosize : false; //default: autosize false
        var width = typeof renderOpt.width !== 'undefined' ? renderOpt.width : 0; //use width defined in LMApp
        var height = typeof renderOpt.height !== 'undefined' ? renderOpt.height : 0; //use height defind in LMApp
        var loc = typeof renderOpt.location !== 'undefined' ? renderOpt.location : gs.ui.LOC_AUTO; //default: select according to LMApp settings
        var resizable = typeof renderOpt.resizable !== 'undefined' ? renderOpt.resizable : false; //default: fixed border
        var exitAppWhenUIClosed = typeof renderOpt.exitAppWhenUIClosed !== 'undefined' ? renderOpt.exitAppWhenUIClosed : true;
        var cleanUpAfterRender = typeof renderOpt.cleanUpAfterRender !== 'undefined' ? renderOpt.cleanUpAfterRender : false;

        _gs.ui_render(url, title, autosize, width, height, loc, resizable, exitAppWhenUIClosed, cleanUpAfterRender);
      },

      show: function() {
        try
        {
            _gs.ui_show();
        }
        catch (ex)
        {
            alert(ex);
        }
      },

      hide: function() {
        _gs.ui_hide();
      },

      setTitle: function(title){
       _gs.ui_setTitle(title);
      }
    },

    //******* Embedded Video Render ********
    video: function(){
      var video_event_listener = function(eventId){
        gs.debugMsg("****** Video Event ******" + eventId);

        if(eventId < 0) { // OnError( errCode ):  eventId ==> Error code ( < 0 )
          if(gs.video.OnError) gs.video.OnError(eventId);
          return;
        }

        switch(eventId){
          case gs.video.VIDEO_EVENT_MOUSE_CLICK:
            if(gs.video.OnClick) gs.video.OnClick(); // OnClick
            break;
          case gs.video.VIDEO_EVENT_MOUSE_ENTER:
            if(gs.video.OnMouseEnter) gs.video.OnMouseEnter();  //OnMouseEnter
            break;

          case gs.video.VIDEO_EVENT_MOUSE_LEAVE:
            if(gs.video.OnMouseLeave) gs.video.OnLeave(); //OnMouseLeave
            break;

          case gs.video.VIDEO_EVENT_MEDIA_LOADED:
            if(gs.video.OnMediaLoaded) gs.video.OnMediaLoaded(); //OnMediaLoaded
            break;

          case gs.video.VIDEO_EVENT_PLAY_FINISHED:
            if(gs.video.OnPlayFinished) gs.video.OnPlayFinished(); //OnPlayFinished
            break;
        }
      }

      var video_state_changed = function(newState, oldState){
        gs.debugMsg("****** Video State Changed from [" + oldState + "] ==> [" + newState + "]");
        if(gs.video.OnStateChanged) gs.video.OnStateChanged(newState, oldState); //OnStateChanged
      }

      _gs.video_signal_event.connect(video_event_listener);
      _gs.video_signal_stateChanged.connect(video_state_changed);

      return {
        //*** Constants ***
        //Playback State
        VIDEO_STATE_LOADING: 0, //Media is loading
        VIDEO_STATE_STOPPED: 1, //Media is stopped
        VIDEO_STATE_PLAYING: 2, //Playing
        VIDEO_STATE_BUFFERING: 3, //The Player is waiting for data to be able to start or continue playing. This state is commonly used to wait for media data over a network connection.	
        VIDEO_STATE_PAUSED: 4, //The media player has currently paused its playback, i.e., it stops playing but keeps the current playback position in the stream.
        VIDEO_STATE_ERROR: 5, //Error occured while playing

        //UI Mask
        VIDEO_UI_PLAY: 1,  //Play Button
        VIDEO_UI_PAUSE: 2,  //Pause Button
        VIDEO_UI_STOP: 4, //Stop Button
        VIDEO_UI_SEEK: 8, //Seek Slider
        VIDEO_UI_VOLUME: 16, //Volume Slider

        //Event
        VIDEO_EVENT_MEDIA_LOADED: 1, //Media file is loaded
        VIDEO_EVENT_PLAY_FINISHED: 2, //Play to end
        VIDEO_EVENT_MOUSE_CLICK: 3, //Mouse Clicked
        VIDEO_EVENT_MOUSE_ENTER: 5, //Mouse Enter Render Area
        VIDEO_EVENT_MOUSE_LEAVE: 6, //Mouse Leave Render Area

        //Error 
        VIDEO_ERROR_MEDIA_NOTFOUND: -1, //Media file not found

        //Error Type
        VIDEO_ERRORTYPE_NOERROR: 0, //No error, ( state() != VIDEO_STATE_ERROR )
        VIDEO_ERRORTYPE_NORMAL: 1, //An error has occurred with the playback of the current source. It might be possible to continue playback, for instance, if only the audio stream in a video cannot be played back. The media object will then leave the error state again.
        VIDEO_ERRORTYPE_FATAL: 2, //Something important does not work. Your program cannot continue the playback of the current source, but it might be possible to try another.

        //--- Position ---
        move: function(x, y, width, height){ _gs.vr_move(x, y, width, height); },
        //--- Display / hide the whole Video Render
        show: function(){ _gs.vr_show(); },
        hide: function(){ _gs.vr_hide(); },
        // Load media from full file path or remote URL
        //     After the media is fully loaded, you need play() to start playing.
        // 
        // IN:
        //     @filepath:  The file path to the local media file.
        //     		It can be absolute path or relative path.
        //
        //     		If it is relative path, it is searched in the following path:
        //     			(1) Application LMApp Path;  (ref: gs.app.lmAppPath )
        //     			(2) Application Root Path;  (ref: gs.app.rootPath )
        //     			(3) Application Main Exe Path;
        //     			(4) System Current Directory;
        // OUTPUT:
        // 	On Error, the VIDEO_ERROR_MEDIA_NOTFOUND signal is emitted.
        //
        loadFile: function(filepath){ _gs.vr_loadFile(filepath); },
        loadUrl: function(url){ _gs.vr_loadUrl(url); },
        //Playback Methods
        play: function(){ _gs.vr_play(); },
        pause: function(){ _gs.vr_pause(); },
        stop: function(){ _gs.vr_stop(); },

        state: function(){ return _gs.vr_state(); },
        errorString: function(){ return _gs.vr_errorString(); },
        errorType: function(){ return _gs.vr_errorType(); },

        isSeekable: function(){ return _gs.vr_isSeekable(); },
        seek: function(posInMs){ _gs.vr_seek(posInMs); },
        currentTime: function(){ return _gs.vr_currentTime(); },
        totalTime: function(){ return _gs.vr_totalTime(); },
        
        setVolume: function( vol){ _gs.vr_setVolume(vol); },
        volume: function(){ return _gs.vr_volume(); },

        // ---- Player Controller Visibility ---
        // AutoHide:  The Controller is visible only when mouse hovers over the render area.
        isControllerAutoHide: function() { return _gs.vr_isControllerAutoHide(); },
        setControllerAutoHide: function( bAutoHide ){ _gs.vr_setControllerAutoHide( bAutoHide); },
        //display / hide controller
        showController: function(){ _gs.vr_showController();},
        hideController: function(){ _gs.vr_hideController();},
        //Is controller visible?
        isControllerVisible: function(){ _gs.vr_isControllerVisible(); },
        //Player Controller UI Elements Mask
        // Turns On / Off the bit mask to show / hide corresponding UI element
        setControllerUIMask: function( uiMask ){ _gs.vr_setControllerUIMask( uiMask ); },
        controllerUIMask: function(){ return _gs.vr_getControllerUIMask(); },
        //Border
        setBorderWidth: function(width){ _gs.vr_setBorderWidth(width); },
        borderWidth: function(){ return _gs.vr_borderWidth(); },
        //Background transparency
        setBackgroundTransparent: function( transparent){ _gs.vr_setBackgroundTransparent(transparent); },
        isBackgroundTransparent: function(){ return _gs.vr_isBackgroundTransparent(); },
        //Status Message
        setStatusMessage: function(msg){ _gs.vr_setStatusMessage(msg); }
      }
    }(),

    app: {
      //Application's root path
      rootPath : _gs.app_getRootPath(),

      //LMApp Path
      lmAppPath: _gs.app_getLMAppPath(),

      buyNowURL: _gs.app_getBuyNowURL(),

      exit : function(rc){
        _gs.app_exit(rc);
      },
      restart : function(){
        _gs.app_restart();
      },
      play : function(){
        _gs.app_play();
      },

      //----- User Defined Event ------------
      //Minimum user defined event id
      GS_USER_EVENT: 0x10000000,

      /// Send user defined event
      //
      // @param eventId user defined event id (>= GS_USER_EVENT)
      // @param message  event message in string format
      sendUserEvent: function(eventId, message){
        _gs.sendUserEvent(eventId, message);
      }
    },

    ///sessionData: Persistent Data across web pages and game multiple passes
    //[Comment] this is different from HTML5::sessionStorage, where data gets lost after web browser is closed. 
    //The sessionData has a long lifetime than sessionStorage that it can survive across multiple game passes. (P1S2, P1S3, etc.)
    sessionData: {
      setVar: function(name, val){ _gs.data_setVar(name, val); },
      getVar: function(name){ return _gs.data_getVar(name); }
    },

    ///globalData: Persistent Data in global storage (shared by all users)
    //[COMMENT] The HTML5::localStorage is persisted per user, globalData is per machine. 
    globalData: {
      setVar: function(name, val){ _createVar(_gs.getVariable(name)).setValue(val); },
      getVar: function(name){ return _createVar(_gs.getVariable(name)).getValue(); }
    },	

    os: {
      ///OS name: "Windows", "Mac"
      name: _gs.getOSName(),
      ///Startup game exe command line
      commandLineArgs: _gs.getCommandLineArgs(),
      ///Environment Variable
      getEnvironmentVariable: function(name){ return _gs.getEnvironmentVariable(name); },

      ///directory access
      homeDir: _gs.getHomeDirectory(),
      dirExists: function(dir){ return _gs.dirExists(dir); },
      createDir: function(dir){ return _gs.createDirectory(dir); },

      ///File access
      fileExists: function(file){ return _gs.fileExists(file); },
      readTextFile: function(file){ return _gs.readTextFile(file); },
      writeTextFile: function(file, content){ return _gs.writeTextFile(file, content); },

      ///Clipboard access
      clipboard: {
        copy: function(content){ _gs.copyToClipboard(content); },
        paste: function(){ return _gs.pasteFromClipboard(); }
      },
	  
      ///Locale
      locale: {
        language: _gs.getDefaultLocaleLang(),
        country: _gs.getDefaultLocaleCountry(),
        //RFC5646  en-US
        BCP47Name: _gs.getDefaultLocaleBCP47Name()
      },
      ///Keyboard
      keyboard: {
        MKEY_SHIFT: 1,
        MKEY_CONTROL: 2,
        MKEY_ALT: 3,

        MKEY_WINDOWS: 4, //Windows only
        MKEY_COMMAND: 5, //Mac only

        isModifierKeyPressed: function(mkey){
          return _gs.isModifierKeyPressed(mkey);
        }
      }
    },
    /// Core SDK Apis
    core : function(){
      //param
      var _createParam = function(h){
        if (h == 0) return null;
        return {
          //properties
          name: _gs.getParamName(h),
          //native data type info, useless in javascript though
          type_id: function(){ return _gs.getParamType(h); },
          type_name: function(){ return _gs.convertParamTypeToString(this.type_id()); },

          //value
          getValue: function(){ return _gs.getParamValue(h); },
          setValue: function(val){ return _gs.setParamValue(h, val); }   
        }
      }

      //action
      var _createAction = function(h){
        if (h == 0) return null;
        return {
          //Properties
          name: _gs.getActionName(h),
          id: _gs.getActionId(h),
          description: _gs.getActionDescription(h),
          //methods
          whatToDo: function(){ return _gs.getActionString(h); },
          //------ Parameters ----------
          getTotalParamCount: function(){	return _gs.getActionParamCount(h); },
          getParamByIndex: function(index){ return _createParam(_gs.getActionParamByIndex(h, index)); },
          getParamByName: function(paramName){ return _createParam(_gs.getActionParamByName(h, paramName)); }
        }	
      }

      //Request
      var _createRequest = function(h){
        if (h == 0) return null;
        return {
            /**
            * Add an action in the request.
            * 
            * @param actId The type of action to add
            * @param license The target license the action apply to. (null) for global action (targeting all entities and licenses)
            * @return the action object. 
            */
            addAction: function(actId, license){ return _createAction(_gs.addRequestAction(h, actId, (license == null) ? 0 : license.handle())); },
            /**
            * Add an action in the request.  (NEW in SDK 5.0.4)
            * 
            * @param actId The type of action to add
            * @param entity The target entity the action apply to. (null) for global action (targeting all entities and licenses)
            * @param license The target license the action apply to. (null) for entity-wide action (targeting all licenses associated with the specified entity)
            * @return the action object. 
            */
            addActionEx: function(actId, entity, license){ return _createAction(_gs.addRequestAction(h, actId, 
                      (entity == null) ? 0 : entity.handle(),
                      (license == null) ? 0 : license.handle())); },
            //Generate request code
            getRequestCode: function(){ return _gs.getRequestCode(h); }
        }  
      }

      //Liense
      var _createLicense = function (h){
        if (h == 0) return null;
        return {
          //properties
          id: _gs.getLicenseId(h),
          name: _gs.getLicenseName(h),
          what: _gs.getLicenseDescription(h),
          //backward compatibility
          description: function(){ return this.what; },

          //INTERNAL USAGE ONLY! Request::addAction() needs it.
          handle: function(){ return h; },
          //status: gs.LICENSE_STATUS_XXX 
          getStatus: function(){ return _gs.getLicenseStatus(h); },
          lock: function(){ _gs.lockLicense(h); },
          //--------License Parameters -----------
          getTotalParamCount: function(){ return _gs.getLicenseParamCount(h); },
          getParamByIndex: function(index){ return _createParam(_gs.getLicenseParamByIndex(h, index));	},
          getParamByName: function(paramName){ return _createParam(_gs.getLicenseParamByName(h, paramName)); },

          getParamValue: function(paramName){ return this.getParamByName(paramName).getValue(); },
              
          //------ License related actions -------------
          getTotalActionCount: function(){ return _gs.getActionInfoCount(h); },
          getActionNameByIndex: function(index) { return _gs.getActionNameByIndex(h, index); },
          getActionIdByIndex: function(index) { return _gs.getActionIdByIndex(h, index); }
        } 
      }

      //Entity
      var _createEntity = function (h){
        if (h == 0) return null;
        return {  
          //properties
          name : _gs.getEntityName(h),            
          id : _gs.getEntityId(h),
          what : _gs.getEntityDescription(h),
          //backward compatibility
          description : function(){ return this.what; },

          //methods
          free : function(){ _gs.closeHandle(h); },

          attribute: function(){ return _gs.getEntityAttributes(h); },
          //attribute helpers
          isAccessible: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_ACCESSIBLE) != 0; },
          isAccessing: function() { return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_ACTIVE) != 0; },
          isFullyLicensed: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_FULLLICENSED) != 0; },
          isUnlocked: function(){ return this.isFullyLicensed(); },
          isLocked: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_LOCKED) != 0; },
          isAutoStart: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_AUTOSTART) != 0; },

          beginAccess: function(){ return _gs.beginAccessEntity(h); },	            
          endAccess: function(){ return _gs.endAccessEntity(h); },

          lock: function(){ _gs.lockEntity(h); }, //Lock the entity
        
          //license associated
          getLicense: function(){ return _createLicense(_gs.openLicense(h)); },

          getTotalLicenseCount: function(){ return _gs.getLicenseCount(h); }, //DEPRECATED
          getLicenseByIndex: function(index){ return _createLicense(_gs.openLicenseByIndex(h, index)); }, //DEPRECATED
          getLicenseById: function(licenseId){ return _createLicense(_gs.openLicenseById(h, licenseId)); }, //DEPRECATED

          //Helper functions
          getTimeLeft: function(){
            var lic = this.getLicense();
            var licId = lic.id;
            if (licId == 'gs.lm.expire.period.1'){
              //Total trial period in seconds
              var periodInSeconds = lic.getParamValue("periodInSeconds");

              var timeFirstAccess = lic.getParamValue("timeFirstAccess");
              if(timeFirstAccess != null){  
                //accessed before, so we can calculate the expiry date
                var expiryDate = new Date(timeFirstAccess.getTime() + periodInSeconds * 1000);
                
                //How many trial time left?
                var now = new Date();
                return ( expiryDate - now )/1000;
              } else {
                //Never accessed, the expiry date is still unknown!
                //How many trial time left = full trial period.
                return periodInSeconds;
              }
            }else if(licId == 'gs.lm.expire.duration.1'){
              //Total trial period in seconds
              var usedDurationInSeconds = lic.getParamValue("usedDurationInSeconds");
              var maxDurationInSeconds = lic.getParamValue("maxDurationInSeconds");
              return maxDurationInSeconds - usedDurationInSeconds;
            }else if(licId == 'gs.lm.expire.accessTime.1'){
              var usedTimes = lic.getParamValue("usedTimes");
              var maxAccessTimes = lic.getParamValue("maxAccessTimes");

              //How many times left the app can launch in trial mode? 
              return maxAccessTimes - usedTimes;
            }else if(licId == 'gs.lm.expire.sessionTime.1'){
              var sessionTimeUsed = lic.getParamValue("sessionTimeUsed");
              var maxSessionTime = lic.getParamValue("maxSessionTime");
              return maxSessionTime - sessionTimeUsed;
            }else if(licId == 'gs.lm.expire.hardDate.1'){
              var expiryDate = lic.getParamValue("timeEnd");
              var now = new Date();
              return ( expiryDate - now )/1000;
            }else{
              //throw "Entity::getTimeLeft: Not supported license model!";
              return -1;
            }
          },

          //Returns formated string of left time in { value, numberString, textString } object
          getTimeLeftString: function(){
              var result = { value: 0, numberString: '', textString: ''};

              var remain = this.getTimeLeft();
              result.value = remain;

              var licId = this.getLicense().id;
              if (licId == 'gs.lm.expire.accessTime.1'){
                result.numberString = remain;
                if (remain > 1) result.textString = "Accesses Left";
                else result.textString = "Access Left";

              } else if(licId == 'gs.lm.alwaysRun.1'){
                result.value = -1;
                result.numberString = '--';
                result.textString = 'Always Run';

              } else if(licId == 'gs.lm.alwaysLock.1'){
                result.value = -2;
                result.numberString = '--';
                result.textString = 'Always Locked';

              } else {
                var remainDay = Math.floor(remain / 60 /60 / 24);
                var remainHr = Math.floor(remain / 60 / 60);
                var remainMin = Math.floor(remain / 60);

                if (remainDay >= 1) {
                    result.numberString = remainDay;
                    result.textString = "Day(s) Left";
                } else if (remainHr >= 1) {
                    result.numberString = remainHr;
                    result.textString = "Hour(s) Left";
                } else if (remainMin >= 1) {
                    result.numberString = remainMin;
                    result.textString = "Minute(s) Left";
                } else {
                    result.numberString = Math.ceil(remain);
                    result.textString = "Second(s) Left";
                }
              }
              
              return result;
          }
        }
      }

      return {//public:
	    	//-------- constants ---------------
        //************ Param Data Type Ids **********
        PARAM_INVALID: 	0,
        //unsigned
        PARAM_UINT8:  	1,
        PARAM_UINT16: 	2,
        PARAM_UINT32:	3,
        PARAM_UINT64: 	4,
        //signed
        PARAM_INT8:  	5,
        PARAM_INT16: 	6,
        PARAM_INT32:	7,
        PARAM_INT64: 	8,

        PARAM_FLOAT:  	9,
        PARAM_DOUBLE:  	10,
        PARAM_BOOL: 	11,
        PARAM_CHAR: 	12,
        PARAM_WIDECHAR: 13,

        //String
        PARAM_STRING: 	  20,
        PARAM_WIDESTRING: 21,
        //DateTime
        PARAM_UTCTIME:	 30,
        //******* Entity Status ***********************       
        /// Entity is currently accessible.
        ENTITY_ATTRIBUTE_ACCESSIBLE: 1,
        /// Entity's license is unlocked / fully activated, no expire /trial limits at all.
        ENTITY_ATTRIBUTE_FULLLICENSED: 2,
        ENTITY_ATTRIBUTE_UNLOCKED: 2,
        /// Entity is active (being accessed via gsBeginAccessEntity())
        ENTITY_ATTRIBUTE_ACTIVE: 4,
        ENTITY_ATTRIBUTE_ACCESSING: 4,
        /// Entity is locked
        ENTITY_ATTRIBUTE_LOCKED: 8,
        /// Entity is auto-start
        ENTITY_ATTRIBUTE_AUTOSTART: 16,


        //****** License Status **************
        LICENSE_STATUS_INVALID : -1, //The current status value is invalid
        LICENSE_STATUS_LOCKED : 0, ///isValid() always return false  the license is expired or disabled permanently.
        LICENSE_STATUS_UNLOCKED : 1,///isValid() always return true, it happens when fully purchased.
        LICENSE_STATUS_ACTIVE : 2, ///isValid() works by its own logic.
        //------ Action Id ----------
        /// Generic actions for all LMs
        ACT_UNLOCK: 			1,
        ACT_DISABLE_COPYPROTECTION: 	7,
        ACT_RESET_ALLEXPIRATION:	10,
		
        ACT_CLEAN: 			11,
        ACT_DUMMY:			12,
		
        //Deprecated by ACT_FIX since 5.3.1
        ACT_FP_FIX:  19,
        ACT_FIX:			19,
		
        ACT_REVOKE:			20,


        // --- LM-specific actions ---
        //LM.expire.accessTime
        ACT_ADD_ACCESSTIME:		100,
        ACT_SET_ACCESSTIME:		101,

        //LM.expire.hardDate
        ACT_SET_STARTDATE:		102,
        ACT_SET_ENDDATE:		103,

        //LM.expire.sessionTime
        ACT_SET_SESSIONTIME:		104,

        //LM.expire.period
        ACT_SET_EXPIRE_PERIOD:		105,
        ACT_ADD_EXPIRE_PERIOD:		106,

        //LM.expire.duration
        ACT_SET_EXPIRE_DURATION:	107,
        ACT_ADD_EXPIRE_DURATION:	108,


        //--------- Event Id -----------
        EVENT_APP_BEGIN: 		1,
        EVENT_APP_END: 			2,
        EVENT_APP_CLOCK_ROLLBACK:	3,

        ///Original license is uploaded to license store for the first time.
        EVENT_LICENSE_NEWINSTALL: 	101,
        ///The application's license store is connected /initialized successfully (gsCore::gsInit() == 0)
        EVENT_LICENSE_READY	: 	102,
        ///The application's license store cannot be connected /initialized! (gsCore::gsInit() != 0)
        EVENT_LICENSE_FAIL	: 	103,

        /*
         * The entity is to be accessed.
         *
         * The listeners might be able to modify the license store here.
         * The internal licenses status are untouched. (inactive if not accessed before)
         */
        EVENT_ENTITY_TRY_ACCESS:	201,		
        
        /*
         * The entity is being accessed.
         *
         * The listeners can enable any protected resources here. (inject decrypting keys, etc.)
         * The internal licenses status have changed to active mode.
         */
        EVENT_ENTITY_ACCESS_STARTED: 	202,
        /*
         * The entity is leaving now.
         *
         * The listeners can revoke any protected resources here. (remove injected decrypting keys, etc.)
         * Licenses are still in active mode.
         */
        EVENT_ENTITY_ACCESS_ENDING:	203,

        /*
         * The entity is deactivated now.
         *
         * The listeners can revoke any protected resources here. (remove injected decrypting keys, etc.)
         * Licenses are kept in inactive mode.
         */
        EVENT_ENTITY_ACCESS_ENDED:	204,

        ///Entity access expired
        EVENT_ENTITY_ACCESS_INVALID:	205,
        /// Internal ping event indicating entity is still alive.
        EVENT_ENTITY_ACCESS_HEARTBEAT:	206,

        //*********** public methods *****************
        //--- Entity ---
        getTotalEntityCount : function(){ return _gs.getEntityCount(); },

        getEntityById: function(entityId){ return _createEntity(_gs.openEntityById(entityId)); },
        getEntityByIndex: function(entityIndex){ return _createEntity(_gs.openEntityByIndex(entityIndex)); },


        //--- Request ---
        createRequest: function(){ return _createRequest(_gs.createRequest()); },

        //--- Apply License Code ---
        applyLicenseCode: function(licenseCode){ return _gs.applyLicenseCode(licenseCode); },
        applyLicenseCodeEx: function(licenseCode, sn, snRef){ return _gs.applyLicenseCodeEx ? _gs.applyLicenseCodeEx(licenseCode, sn, snRef) : _gs.applyLicenseCode(licenseCode); },

        //--- Error Report ---
        //API error info
        getLastErrorCode: function(){ return _gs.getLastErrorCode(); },	
        getLastErrorMessage: function(){ return _gs.getLastErrorMessage(); },
        //current event's error message
        getEventErrorMessage: function(){ return _gs.getEventErrorMessage ? _gs.getEventErrorMessage() : ''; },
		
        //------ Event handler ------
        getCurrentEntityId: function(){ return _gs.getCurrentEntityId(); },
        // get current entity object the Web page is coping with
        getCurrentEntity: function(){ return this.getEntityById(this.getCurrentEntityId()); },
		
        getCurrentEventId: function() { return _gs.getCurrentEventId(); },
		

        //------ Revoke license ------
        //Returns: true on success 
        revokeApp: function(sn){ return _gs.core_revokeApp ? _gs.core_revokeApp(sn) : ''; },
        revokeSN: function(sn){ return _gs.core_revokeSN ? _gs.core_revokeSN(sn) : ''; },
		
        //Get the preliminary serial number
        getPreliminarySN: function(){ return _gs.core_getPreliminarySN ? _gs.core_getPreliminarySN() : ''; },

        getDummyRequestCode: function(){ return gs.util.getDummyRequestCode(); },

        //SN
        isServerAlive: function(){ return _gs.isServerAlive(); },
        isSNValid: function(serial){ return _gs.isSNValid(serial); },
        applySN: function(serial){ return _gs.applySN(serial); },

        //------ Debug Helper -------
        isDebugVersion: function(){
          return _gs.isDebugVersion();
        },

        trace: function(msg){
          _gs.debugMsg(msg);
        },

        getUniqueNodeId: function(){
          return _gs.getUniqueNodeId();
        },

        isAppPublished: function(){
          return checkPointServers && checkPointServers.length > 0;
        },

        isOnlineActivationPreferred: function(){//SDK 5.2.0.4+
          return this.isAppPublished() && _gs.isOnlineActivationPreferred();
        },

        isAppFirstLaunched: function(){//SDK 5.2.1
          return _gs.isAppFirstLaunched();
        }
      } //public
    }(),//core

    /** [gs.single]
    *
    *  The most simple yet important use case defines only 1 entity with 1 associated license model.
    *  
    *  The following short-cuts might help simplify code ;-) 
    */
    single : {
      getEntity: function(){ return gs.core.getEntityByIndex(0); },
      getLicense: function(){ return gs.core.getEntityByIndex(0).getLicenseByIndex(0); },
      getUnlockRequestCode: function(){ return gs.util.getUnlockRequestCode(this.getLicense()); },
      getAddDurationRequestCode: function(){ return gs.util.getAddDurationRequestCode(this.getLicense()); }
    },

    //[gs.util]  commonly used functions based on gs.core and implemented in pure Javascript.
    util : { 
      // Generate the request code for offline activation
      getDummyRequestCode: function(){
        var request = gs.core.createRequest();
        request.addAction(gs.core.ACT_DUMMY, null); 
        return request.getRequestCode();
      },	

      //Generate the request code to unlock/fully-purchase a license.
      getUnlockRequestCode: function(license){
        var request = gs.core.createRequest();
        request.addAction(gs.core.ACT_UNLOCK, license); 
        return request.getRequestCode();
      },
      // Generate the request code to cleanup local license storage
      getCleanMachineRequestCode: function(){
        var request = gs.core.createRequest();
        request.addAction(gs.core.ACT_CLEAN, null); 
        return request.getRequestCode();
      },	
      getAddDurationRequestCode: function(license){
        var request = gs.core.createRequest();
        var action = request.addAction(gs.core.ACT_ADD_EXPIRE_DURATION, license); 
        var param = action.getParamByName('addedDuration');
        param.setValue(1800);
        return request.getRequestCode();
      },
    
      launchDefaultBrowser: function(url){
        _gs.launchDefaultBrowser(url);
      },

      mailTo: function(to, title, msg){
        _gs.launchDefaultBrowser('mailto:' + to + '?subject=' + encodeURIComponent(title) +'&body=' + encodeURIComponent(msg));
      }
    }
  }//gs::return
}();

/** Randy: GS5/PC support
}
*/
