import { Transform } from 'stream';
import fs from 'fs';

let buffer = '';

fs.createReadStream('FL_insurance_sample.csv')
  /* Т.к. чанки могут содержать куски строк или захватывать следующие строки,
     переразобьём их на строки (разделитель - ;) */
  .pipe(new Transform({
    transform: function (chunk, encoding, cb) {
      console.log(chunk);
      buffer += chunk.toString();
      let lines = buffer.split(';');
      buffer = lines.pop();
      lines.forEach((line) => {
        this.push(line + "\n");
      });
      cb();
    },
    /* Если интересно почему так - спроси меня в скайпе */
    flush: function (cb) {
      this.push(buffer);
      cb();
    }
  }))
  /* Выведем построчно */
  .pipe(process.stdout);
