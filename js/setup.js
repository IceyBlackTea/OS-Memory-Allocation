/*
 * @Author: One_Random
 * @Date: 2020-07-14 08:58:47
 * @LastEditors: One_Random
 * @LastEditTime: 2020-07-16 14:49:02
 * @FilePath: /OS/js/setup.js
 * @Description: Copyright © 2020 One_Random. All rights reserved.
 */ 
const debug = false;
const release = true;
var jobs = new Array();
var system;
var anime;
var input_size = 0;
async function set_up_system() {
    // let set_mem_select = document.getElementById('setofmem');
    // let setofmem = parseInt(set_mem_select.options[set_mem_select.selectedIndex].value);
    // let size = parseInt(setofmem * document.getElementById('max_mem_size').value);
    let size = parseInt(document.getElementById('max_mem_size').value);
    input_size = size;
    
    let algorithm_select = document.getElementById('algorithm');
    let type = algorithm_select.options[algorithm.selectedIndex].value;

    // error handle
    if (size <= 0){
        console.alert("memory size cannot be less than 1 bytes");
        return;
    }
        
    system = new System(size, type);
    system_back = new System(size, type);

    // console.log(jobs);
    // system.add_jobs(jobs);

    update_job_display();
    
    // add debug info
    if (debug)
        console.log(system)

    // set_svg(400, 400, size);

    if (release) {
        let str = "The system has been set up and initialized.\n" 
            + "The memory size is " + size + " " + "MB.\n"
            + "The allocation algorithm is " +  type + ".\n\n"
            + "The system has been initialized.\n";
            + "Now the size of the used is 0 bytes.\n";
    }
}

function remove_all_jobs() {
    // document.getElementById('confirmed_jobs').innerHTML = "";
    if (system != undefined) {
        jobs.length = 0;
        
        if (release) {
            let str = "The jobs has been removed.\n";
        }
    }   
    else {
        if (release) {
            let str = "The system has not been set up!\n" 
                + "Please set up the system first!\n";
        }
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

        if (jobs_json != undefined) {
            for (let i = 0; i < jobs_json.length; i++) {
                job = jobs_json[i];

                // add debug info
                if (debug)
                    console.log(job);

                jobs.push(job);
            //    system.add_job(job);
            }
            // update_job_display();
        }
        else {
            if (release) {
                let str = "The file isn't supported!\n" 
                    + "Please check the file!\n";
            }
            alert("The file isn't supported!")
        }
    };
}

function add_a_job() {
    let order_number = parseInt(document.getElementById('order_number').value);

    let set_job_select = document.getElementById('setofjob');
    // let setofjob = parseInt(set_job_select.options[set_job_select.selectedIndex].value);
    // let size = parseInt(setofjob * document.getElementById('size').value);
    let size = parseInt(document.getElementById('job_size').value);

    let in_time = parseInt(document.getElementById('in_time').value);
    let run_time = parseInt(document.getElementById('run_time').value);
    
    let job = new Job(order_number, size, in_time, run_time);

    jobs.push(job);

    update_job_display();
}

function display_manually() {
    if (document.getElementById('manually').innerHTML == 'hide') {
        document.getElementById('input').style='display:none'; 
        document.getElementById('manually').innerHTML = 'add jobs manually';
    }
    else {
        document.getElementById('input').style='display:block'; 
        document.getElementById('manually').innerHTML = 'hide';
    }
}

function pause() {
    anime.go_on = !anime.go_on;
    let btn = document.getElementById("btn-pause");
    if (btn.innerHTML == "pause") {
        btn.innerHTML = "resume";
    } 
    else {
        btn.innerHTML = "pause";
    }
    anime.auto_play();
}

function reset() {
        if (document.getElementById('btn-reset').innerHTML == 'set jobs') {
            document.getElementById('btn-reset').innerHTML = 'reset jobs';
            document.getElementById('btn-reset').style = 'width: 80px; background-color: #e34c25; color:white; margin-left: 150px;';
            document.getElementById('btn-pause').innerHTML = 'pause'; 
            system.type = document.getElementById('algorithm').options[algorithm.selectedIndex].value;
            system.run();
            set_svg(400, 400, input_size);
            anime = new Anime();
        }
        else {
            pause();
            anime = new Anime();
            anime.go_on = true;
            if (system != undefined)
                system = system_back;
            system.type = document.getElementById('algorithm').options[algorithm.selectedIndex].value;
            system.run();
            document.getElementById('btn-pause').innerHTML = 'pause'; 
            reset_svg(400, 400, input_size);   
        }      
}

async function load_jobs() {
    if (document.getElementById('btn-reset').innerHTML == 'set jobs') {
        document.getElementById('btn-reset').innerHTML = 'reset jobs';
        document.getElementById('btn-reset').style = 'width: 80px; background-color: #e34c25; color:white; margin-left: 80px;';
        document.getElementById('btn-pause').innerHTML = 'pause'; 
        await set_up_system();
        for (let i = 0; i < jobs.length; i++) {
           await system.add_job(jobs[i]);
        }
        sleep(0).then(() => {system.run();});
        set_svg(400, 400, input_size);
        anime = new Anime();
    }
    else {
        pause();
        
        reset_svg(400, 400, input_size);
        set_up_system();
        for (let i = 0; i < jobs.length; i++) {
            system.add_job(jobs[i]);
        }
        sleep(0).then(() => {system.run();});
        document.getElementById('btn-pause').innerHTML = 'pause'; 
        anime = new Anime();
           
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