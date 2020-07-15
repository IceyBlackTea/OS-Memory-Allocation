/*
 * @Author: One_Random
 * @Date: 2020-07-14 08:58:47
 * @LastEditors: One_Random
 * @LastEditTime: 2020-07-15 08:58:25
 * @FilePath: /OS/js/setup.js
 * @Description: Copyright © 2020 One_Random. All rights reserved.
 */ 
var debug = true;
    var system;
    function set_up_system() {
        let set_mem_select = document.getElementById('setofmem');
        let setofmem = parseInt(set_mem_select.options[set_mem_select.selectedIndex].value);
        let size = parseInt(setofmem * document.getElementById('max_mem_size').value);
        
        let algorithm_select = document.getElementById('algorithm');
        let type = algorithm_select.options[algorithm.selectedIndex].value;

        // error handle

        system = new System(size, type);

        update_job_display();
        
        // add debug info
        if (debug)
            console.log(system)

        set_svg(400, 400, size);
    }

    function remove_all_jobs() {
        // document.getElementById('confirmed_jobs').innerHTML = "";
        if (system != undefined)
            system.remove_jobs();
        else {
            // error handle
            return;
        }   
    }
    
    function read_from_file() {
        remove_all_jobs();
        
        let selectedFile = document.getElementById("json_file").files[0];
        let reader = new FileReader();
        let jobs_json;
        reader.readAsText(selectedFile);

        reader.onload = function(){
            jobs_json = JSON.parse(this.result);

            // error handle

            if (jobs_json != undefined) {
                for (let i = 0; i < jobs_json.length; i++) {
                    job = jobs_json[i];

                    // add debug info
                    if (debug)
                        console.log(job);

                    system.add_job(job);
                }
                update_job_display();
            }
        };
    }

    function add_a_job() {
        let order_number = parseInt(document.getElementById('order_number').value);

        let set_job_select = document.getElementById('setofjob');
        let setofjob = parseInt(set_job_select.options[set_job_select.selectedIndex].value);
        let size = parseInt(setofjob * document.getElementById('size').value);

        let in_time = parseInt(document.getElementById('in_time').value);
        let run_time = parseInt(document.getElementById('run_time').value);

        // error handle
        
        let job = new Job(order_number, size, in_time, run_time);


        let result = system.add_job(job);

        // add debug info
        if (debug)
            console.log(result, job);

        update_job_display();
    }

    function step() {
        let rounds = parseInt(document.getElementById("second").value);
        let round = 0;
        while(round <= rounds) {
            system.step();
            system.print();
            round += 1;
        }
    }

    function update_job_display() {
        sleep(0).then(() => {
            // let jobs_str = "";
            // for (let i = 0; i < system.wait_jobs.length; i++) {
            //     let job = system.wait_jobs[i];
            //     order_number_str = "order number: " + job.order_number;
            //     size_str = "size: " + job.size;
            //     in_time_str = "in time: " + job.in_time;
            //     run_time_str = "run time: " + job.run_time;

            //     job_str = "<br>" + order_number_str + "<br>" + size_str + "<br>" + in_time_str + "<br>" + run_time_str + "<br>";
            //     jobs_str += job_str;
            // }
            
            // document.getElementById('confirmed_jobs').innerHTML = jobs_str;
            });
    }