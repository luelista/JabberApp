
.PHONY:	run-osx

run-osx:
	./BuildResources/nw-osx-x64/node-webkit.app/Contents/MacOS/node-webkit ./App/
	

build-win32: JabberApp.nw
	echo "Windows Build"
	
	rm -rf "./Build/Win32/"
	mkdir -p "./Build/Win32/"
	cp -r ./BuildResources/nw-win-ia32/* "./Build/Win32/"
	#cat ./Build/Win32/nw.exe ./Build/JabberApp.nw > ./Build/Win32/JabberApp.exe
	#rm ./Build/Win32/nw.exe
	mv ./Build/Win32/nw.exe ./Build/Win32/JabberApp.exe
	#cp ./Build/JabberApp.nw ./Build/Win32/app.nw
	cp -r ./App/* ./Build/Win32/
	rm ./Build/Win32/nwsnapshot.exe
	# figure out how to run nsis on mac ^^

JabberApp.nw:
	cd App; zip -r ../Build/JabberApp.nw *
	
	

build-osx:
	echo "OS X Build"
	rm -rf "./Build/OS X/"
	mkdir -p "./Build/OS X/"
	cp -r "./BuildResources/nw-osx-x64/node-webkit.app" "./Build/OS X/JabberApp.app"
	cp -r "./App" "./Build/OS X/JabberApp.app/Contents/Resources/app.nw"

build: build-win32 build-osx

