/*
 * @Author: One_Random
 * @Date: 2020-07-06 10:50:57
 * @LastEditors: One_Random
 * @LastEditTime: 2020-07-06 16:40:59
 * @FilePath: /OS/memory.js
 * @Description: Copyright © 2020 One_Random. All rights reserved.
 */ 

/*
 * 系统的类
 */
class System {
    constructor(max_mem_size) {
        this.memory = new Memory(max_mem_size);
        this.jobs = new Array();
    }

    add_job(job) {
        this.jobs.push(job);
    }
}

/*
 * 模拟的内存的类
 */
class Memory {
    constructor(max_size) {
        // 声明一个分区对象，添加到分区数组中
        var part = new Part(0, max_size);
        var mem_parts = new Array();
        mem_parts.push(part);

        this.size = max_size; // 内存大小
        this.used_size = 0; // 已使用的内存大小
        this.parts = mem_parts; // 指向内存分区
        this.max_order_number = 0; // 指向内存分区最大编号
    }

    // 首次适应算法
    
    // 最佳适应算法

    // 最差适应算法

    // 添加作业到内存中
    load_job(time, part_num, jobs, job_num) {
        // 将旧的分区拆开出新的分区
        let part = this.parts[part_num];
        let new_part = new Part(this.max_order_number + 1, part.size - job.size);
        this.parts.splice(part_num + 1, 0, new_part);

        // 旧分区装入作业
        part.size = job.size;
        part.job_num = job.order_number;

        // 设置作业属性，开始运行
        job.start_time = time;
        job.end_time = job.start_time + job.run_time;

        this.used_size += job.size;
        this.max_order_number += 2;
    }

    // 完成作业，释放内存资源
    unload_job(time, jobs) {
        // 遍历寻找完成的作业
        for (let i = 0; i < this.parts.length; i++) {
            let part = this.parts[i];
            if (part.job_num == -1)
                continue;
            
            let job = jobs[part.job_num];
            let new_part;
            if (job.end_time == time) {
                // 判断前一个分区能否与其合并
                if ((i > 0) && this.parts[i - 1].job_num == -1) {
                    new_part = new Part(this.max_order_number + 1, part.size + this.parts[i - 1].size);
                    this.parts.splice(i - 1, 2, new_part);
                    i -= 1;
                }
                else
                    this.max_order_number += 1;

                this.parts[i].job_num = -1;

                this.used_size -= job.size;
            }
        }
    }
    // 输出信息，用于debug
    print() {
        console.log('memory info');
        console.log('memory size: ' + this.size);
        console.log('memory used: ' + this.used_size);
        console.log('\n');
        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].print();
        }
    }
}

/*
 * 模拟的内存分区的类
 */
class Part {
    constructor(order_number, size) {
        this.order_number = order_number; // 分区序号
        this.size = size; // 分区大小
        this.job_num = -1; // 装入的作业编号, -1代表可用
    }
    
    // 输出信息，用于debug
    print() {
        console.log('part info');
        console.log('order number:' + this.order_number);
        console.log('part size:' + this.size);
        console.log('job number:' + this.job_num);
    }
}

/*
 * 作业的类
 */
class Job {
    constructor(order_number, size, run_time) {
        this.order_number = order_number; // 作业序号
        this.size = size; // 作业使用的内存大小
        this.in_time = -1; // 作业进入内存时间
        this.run_time = run_time; // 作业运行需要的时间
        this.start_time = -1; // 作业开始运行的时间
        this.end_time = -1; // 作业结束运行的时间
    }
}

console.log('--init')
var system = new System(100 * 1024 * 1024);
job = new Job(0, 10, 5);
system.add_job(job);

system.memory.print();
console.log('\n');

console.log('--add job 0');
system.memory.load_job(0, 0, system.jobs, 0);
system.memory.print();

console.log('--finish job 0')
system.memory.unload_job(5, system.jobs);
system.memory.print();

