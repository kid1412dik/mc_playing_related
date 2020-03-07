@ cd "./frontend/vue"

@ echo Type 'exit' when npm run finished to run the rest code
@ pause
cmd /k "npm run build"


cd ..
cd ..

dir

rd /s /Q "./Client/dist/"
md "./Client/dist/"

xcopy "./frontend/vue/dist" "./Client/dist" /s /e /y

rd /s /Q "./Server/server/express/"
md "./Server/server/express/"

xcopy "./backend/express" "./Server/server/express" /s /e /y

% pause