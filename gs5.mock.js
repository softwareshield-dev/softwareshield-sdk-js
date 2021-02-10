/**
*  Javascript wrapper for GameShield Core. (www.gameshield.com)
*
*  Created on	: 2015-11-16
*
*  This is a mock version for preview UI pages in any web browser
*/

var prjData = {
  version: "1.0",
  productName: "Test App",
  productId: "Test ID",
  buildId: 1,

  //ui
  remoteUrlBase: "http://www.google.com",
  localDir: "UI_HTML",
  loadTimeOut: 5,
  unloadTimeOut: 0,

  //
  rootDir: "",
  uiDir: "",
  buyNowUrl: "http://www.google.com",

  osName: "Windows",
  cmdLine: "",
  homeDir: "",

  defaultLocale: "en",
  defaultCountry: "us",
  defaultLocaleName: "en",

  debugVersion: true,

  sessionData: {
    setVar: function(name, val){ if(sessionStorage) sessionStorage.setItem(name, val); },
    getVar: function(name, val){ return sessionStorage ? sessionStorage.getItem(name) : ""; }
  },

  entities: [
    { name: "E1", id: "123", description: "--- E1 ---", 
      attr: function(){ return gs.ENTITY_ATTRIBUTE_ACCESSIBLE; },

      license: {
        id: "gs.lm.alwaysLock.1",
        status: function(){ return gs.LICENSE_STATUS_ACTIVE; }
      }
    }  
  ],
  entityCount: 1,
  currentEntityId: "123",
  openEntityById: function( entityId){ var i = 0; this.entities.forEach(function(e, index){ if(e.id == entityId) i = index; }); return i; },
  openEntityByIndex: function( entityIndex){ return entityIndex; },

  openLicense: function( entityIndex){ return entityIndex; },
  openLicenseByIndex: function( entityIndex, index){ return entityIndex; },
  openLicenseById: function( entityIndex, licId){ return entityIndex; },

  app: {
    play: function(){ alert('play'); },
    exit: function(rc){ alert('exit(' + rc + ')'); },
    restart: function(){ alert('restart'); }
  },

  launchDefaultBrowser: function(url){
    window.location = url;
  }
};

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
    version : prjData.version,
    productName: prjData.productName,
    productId : prjData.productId,
    buildId: prjData.buildId,
    
    debugMsg: function(msg){
      console.log(msg);
    },

    ui: {
      //LMApp Location Constants
      LOC_LOCAL: 0,  //Use local lmApp version
      LOC_REMOTE: 1, //Use remote lmApp version
      LOC_AUTO: 2, //Select lmApp according to its settings in lmapp.config

      remoteUrlBase: prjData.remoteUrlBase,
      localDir: prjData.localDir,

      close: function(rc){
        alert('Close current window');
        window.close();
      },
      open: function(url, title, autosize, width, height){
        window.open(url, "_blank", "width="+width + ", height="+height);
      },

      loadTimeOut: function(){
        return prjData.loadTimeOut;
      },
      setLoadTimeOut: function(maxTimeOutInSeconds){
        prjData.loadTimeOut = maxTimeOutInSeconds;
      },

      unloadTimeOut: function(){
        return prjData.unloadTimeOut;
      },
      setUnloadTimeOut: function(maxTimeOutInSeconds){
        prjData.unloadTimeOut = maxTimeOutInSeconds;
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
        window.location = url;
      },

      show: function() {
        try
        {
         // alert("gs.ui.show(): Not implementated in mock version!");
        }
        catch (ex)
        {
            alert(ex);
        }
      },

      hide: function() {
         alert("gs.ui.hide(): Not implementated in mock version!");
      },

      setTitle: function(title){
         alert("gs.ui.setTitle(): Not implementated in mock version!");
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

      //_gs.video_signal_event.connect(video_event_listener);
      //_gs.video_signal_stateChanged.connect(video_state_changed);

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
      rootPath : prjData.rootDir,

      //LMApp Path
      lmAppPath: prjData.uiDir,

      buyNowURL: prjData.buyNowUrl,

      exit : function(rc){
        prjData.app.exit(rc);
      },
      restart : function(){
        prjData.app.restart();
      },
      play : function(){
        prjData.app.play();
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
      setVar: function(name, val){ prjData.sessionData.setVar(name, val); },
      getVar: function(name){ return prjData.sessionData.getVar(name); }
    },

    ///globalData: Persistent Data in global storage (shared by all users)
    //[COMMENT] The HTML5::localStorage is persisted per user, globalData is per machine. 
    globalData: {
      setVar: function(name, val){ _createVar(_gs.getVariable(name)).setValue(val); },
      getVar: function(name){ return _createVar(_gs.getVariable(name)).getValue(); }
    },	

    os: {
      ///OS name: "Windows", "Mac"
      name: prjData.osName,
      ///Startup game exe command line
      commandLineArgs: prjData.cmdLine,
      ///Environment Variable
      getEnvironmentVariable: function(name){ return _gs.getEnvironmentVariable(name); },

      ///directory access
      homeDir: prjData.homeDir,
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
		  language: prjData.defaultLocale,
		  country: prjData.defaultCountry,
		  //RFC5646  en-US
		  BCP47Name: prjData.defaultLocaleName
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
        //if (h == 0) return null;
        var lic =  prjData.entities[h].license;
        return {
          //properties
          id: lic.id,

          //INTERNAL USAGE ONLY! Request::addAction() needs it.
          handle: function(){ return h; },
          //status: gs.LICENSE_STATUS_XXX 
          getStatus: function(){ return lic.status(); },
          lock: function(){ _gs.lockLicense(h); },
          //--------License Parameters -----------
          getTotalParamCount: function(){ return _gs.getLicenseParamCount(h); },
          getParamByIndex: function(index){ return _createParam(_gs.getLicenseParamByIndex(h, index));	},
          getParamByName: function(paramName){ return _createParam(_gs.getLicenseParamByName(h, paramName)); },
          //------ License related actions -------------
          getTotalActionCount: function(){ return _gs.getActionInfoCount(h); },
          getActionNameByIndex: function(index) { return _gs.getActionNameByIndex(h, index); },
          getActionIdByIndex: function(index) { return _gs.getActionIdByIndex(h, index); }
        } 
      }

      //Entity
      var _createEntity = function (h){
        //if (h == 0) return null;
        var e = prjData.entities[h];
        return {  
          //properties
          name: e.name,
          id : e.id,
          description : function(){ return e.description; },

          //methods
          free : function(){ },

          attribute: function(){ return e.attr(); },
          //attribute helpers
          isAccessible: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_ACCESSIBLE) != 0; },
          isAccessing: function() { return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_ACTIVE) != 0; },
          isFullyLicensed: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_FULLLICENSED) != 0; },
          isLocked: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_LOCKED) != 0; },
          isAutoStart: function(){ return (this.attribute() & gs.core.ENTITY_ATTRIBUTE_AUTOSTART) != 0; },

          beginAccess: function(){ return _gs.beginAccessEntity(h); },	            
          endAccess: function(){ return _gs.endAccessEntity(h); },

          lock: function(){ _gs.lockEntity(h); }, //Lock the entity
        
          //license associated
          getLicense: function(){ return _createLicense(prjData.openLicense(h)); },

          getTotalLicenseCount: function(){ return 1; }, //DEPRECATED
          getLicenseByIndex: function(index){ return _createLicense(prjData.openLicenseByIndex(h, index)); }, //DEPRECATED
          getLicenseById: function(licenseId){ return _createLicense(prjData.openLicenseById(h, licenseId)); } //DEPRECATED
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
        getTotalEntityCount : function(){ return prjData.entityCount; },

        getEntityById: function(entityId){ return _createEntity(prjData.openEntityById(entityId)); },
        getEntityByIndex: function(entityIndex){ return _createEntity(prjData.openEntityByIndex(entityIndex)); },


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
        getCurrentEntityId: function(){ return prjData.currentEntityId; },
        // get current entity object the Web page is coping with
        getCurrentEntity: function(){ return this.getEntityById(this.getCurrentEntityId()); },
		
        getCurrentEventId: function() { return _gs.getCurrentEventId(); },
		

        //------ Revoke license ------
        //Returns: true on success 
        revokeApp: function(sn){ return _gs.core_revokeApp ? _gs.core_revokeApp(sn) : ''; },
        revokeSN: function(sn){ return _gs.core_revokeS ? N_gs.core_revokeSN(sn) : ''; },
		
        //Get the preliminary serial number
        getPreliminarySN: function(){ return _gs.core_getPreliminarySN ? _gs.core_getPreliminarySN() : ''; },

        //------ Debug Helper -------
        isDebugVersion: function(){
          return prjData.debugVersion;
        },

        trace: function(msg){
          _gs.debugMsg(msg);
        },

        getUniqueNodeId: function(){
          return _gs.getUniqueNodeId();
        },

        isOnlineActivationPreferred: function(){//SDK 5.2.0.4+
          return _gs.isOnlineActivationPreferred();
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
        prjData.launchDefaultBrowser(url);
      },

      mailTo: function(to, title, msg){
        prjData.launchDefaultBrowser('mailto:' + to + '?subject=' + title +'&body=' + encodeURIComponent(msg));
      }
    }
  }//gs::return
}();

/** Randy: GS5/PC support
}
*/
