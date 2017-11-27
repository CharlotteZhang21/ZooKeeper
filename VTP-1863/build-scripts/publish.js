var fs = require('fs');
var settings = JSON.parse(fs.readFileSync('./publish-settings.json', 'utf8'));

var exec = require('child_process').exec;

var path = 'dist';

// clean dist directory
exec('rm -r ' + path, function(err, stdout, stderr) {

    exec('mkdir dist', function(err, stdout, stderr) {

        settings.versions.forEach(function(v) {

            exec('cp -R build dist/' + v.label, function(err, stdout, stderr) {

                if (err === null) {

                    for (var v1 in v.settings) {

                        if (v.settings.hasOwnProperty(v1)) {

                            if (typeof v.rename !== 'undefined') {

                                v.rename.forEach(function(r) {
                                    exec('mv -f ' + path + '/' + v.label + '/' + r.file + ' ' + path + '/' + v.label + '/' + r.to);
                                }, this);
                            }

                            if (typeof settings.delete !== 'undefined') {

                                settings.delete.forEach(function(fileName) {
                                    exec('rm -f ' + path + '/' + v.label + '/' + fileName);
                                }, this);
                            }

                            settings.replaceIn.forEach(function(r) {

                                exec('sed -i.original "s:' + v1 + '.*:' + v1 + ' = ' + v.settings[v1] + ';:g" ' + path + '/' + v.label + '/' + r, function(err, stdout, stderr) {

                                    exec('cd ' + path + '/' + v.label + ' && ' +
                                        'zip -r ' + v.label + '.zip * -x "*.DS_Store" -x "__MACOSX/\\*" -x "*.original" && ' +
                                        'unzip -l ' + v.label + '.zip && ' +
                                        'cd .. && ' +
                                        'mv ' + v.label + '/' + v.label + '.zip ./',
                                        function(err, stdout, stderr) {

                                            if (err === null) {
                                                console.log('successfully zipped ' + v.label + '.zip');
                                            }
                                        });
                                });
                            }, this);                            
                        }
                    }
                }
            });
        }, this);
    });
});
