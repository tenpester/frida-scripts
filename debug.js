'use strict';
var resolver = new ApiResolver('objc');
var NSUserDefaults_setObject_forKey = {};
var NSUserDefaults_blacklist = [
  'UIKit', 'libobjc.A.dylib',
  'WebKitLegacy', 'libdispatch.dylib',
  'CoreFoundation', 'Foundation',
  'libsystem_pthread.dylib', 'UIFoundation'
];
resolver.enumerateMatches('-[NSUserDefaults setObject:forKey:]', {
  onMatch: function (match) {
    if (match.name === '-[NSUserDefaults setObject:forKey:]') {
      NSUserDefaults_setObject_forKey.name = match.name;
      NSUserDefaults_setObject_forKey.address = match.address;
    }
  },
  onComplete: function () {}
});
if (NSUserDefaults_setObject_forKey.address) {
  Interceptor.attach(NSUserDefaults_setObject_forKey.address, {
    onEnter: function (args) {
      var UserDefaultsBlob = {};
      var UserDefaultsValue = new ObjC.Object(args[2]);
      var UserDefaultsKey = new ObjC.Object(args[3]);
      UserDefaultsKey = UserDefaultsKey.UTF8String();
      UserDefaultsValue = UserDefaultsValue.UTF8String();
      UserDefaultsBlob[UserDefaultsKey] = UserDefaultsValue;
      /*   --- Payload Header --- */
      var send_data = {};
      send_data.time = new Date();
      send_data.txnType = 'UserDefaults';
      send_data.lib = 'libobjc.a.dylib';
      send_data.method = '+[NSUserDefaults setObject:forKey:]';
      send_data.trace = trace();
      send_data.artifact = [];
      /*   --- Payload Body --- */
      var data = {};
      data.name = "UserDefaults Write";
      data.value = UserDefaultsBlob;
      data.argSeq = 2;
      send_data.artifact.push(data);
      send(JSON.stringify(send_data));
      console.log(JSON.stringify(send_data));
    }
  });
}