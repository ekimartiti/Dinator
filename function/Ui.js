const chalk = require('chalk');

const gaya = {
 dinatorG: `${chalk.red(`
 ######  ### #     #    #    ####### ####### ######     
 #     #  #  ##    #   # #      #    #     # #     #    
 #     #  #  # #   #  #   #     #    #     # #     #    
 #     #  #  #  #  # #     #    #    #     # ######     
 #     #  #  #   # # #######    #    #     # #   #      
 #     #  #  #    ## #     #    #    #     # #    #     
 ######  ### #     # #     #    #    ####### #     #    
                                                        `)}`,

 kidattG: `${chalk.red(`
                                   
                 .                 
              .......              
          .::^^^^^^^^^:.           
         :^^^^^^^^^^^^^^:.         
        .^^^^^^^~7^^^^^^^.         
       :~^^^^^!75J^~!~~^^^.        
       ${chalk.blue(`?B775Y!75P?JY!7J~YB~        
       .~!J##BB#&&&BGGBYJ!.        
          .!YPB&&&&BG57.`)}           
            :^~YPPJ~^.             
           :^^^7?J!^^^:            
          .^^?5!~!!~JJ^.           
          .^^!7^^^^^~~^:           
           .^^^^7?~^^:..           
          .^^^^^!7~^^^::           
         .^^^^^^^^^^^^^^:          
          ::^^^^. .^^^::           
             :^^:.:^^:             
              .::::::              `)}`,}
              

const pesan = {
  proses: "Sedang memproses data",
  error: "Error terjadi kesalahan"
}

const errorC = (err) => {
  return chalk.red(`[ERROR] ${err}`);
};

module.exports = {gaya, pesan, errorC};
