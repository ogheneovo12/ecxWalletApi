const bcrypt = require("bcrypt");
(async ()=>{
    const test =await bcrypt.compare("1234","$2b$12$bJ1NCzJ3lekpqyrk.5vJxeZDodD1hUs4uOU6EtAU890HnOAco6LvW")
    console.log(test)
})()
