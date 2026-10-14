import assert from 'node:assert/strict';
import {weekDays,monthCells,shiftDay,occurs,packEvents,timeMinutes} from './agendaModel.ts';
assert.deepEqual(weekDays('2026-10-13'),['2026-10-12','2026-10-13','2026-10-14','2026-10-15','2026-10-16','2026-10-17','2026-10-18']);
assert.deepEqual(weekDays('2027-01-01').slice(0,2),['2026-12-28','2026-12-29']);
assert.equal(shiftDay('2028-02-28',1),'2028-02-29');
assert.ok(monthCells('2028-02-10').includes('2028-02-29'));
const event=(id,time,duration)=>({id,time,duration,date:'2026-10-13',name:id,agentId:'',repeat:'none'});
const schedule=[event('review','09:00',90),event('call','09:15',30),event('notes','10:00',30),event('lunch','12:00',60),event('late','23:45',15)];
const packed=packEvents(schedule);
assert.equal(packed.find(e=>e.event.id==='review').lanes,2);
assert.equal(packed.find(e=>e.event.id==='notes').lane,packed.find(e=>e.event.id==='call').lane);
assert.equal(packed.find(e=>e.event.id==='lunch').lanes,1);
for(let minute=0;minute<1440;minute++){
 const current=packed.filter(p=>timeMinutes(p.event.time)<=minute&&timeMinutes(p.event.time)+p.event.duration>minute);
 assert.equal(new Set(current.map(p=>p.lane)).size,current.length,'overlapping events occupy distinct columns');
}
const weekly={...event('repeat','11:00',30),repeat:'weekly'};
assert.ok(occurs(weekly,'2026-10-20'));
assert.ok(!occurs(weekly,'2026-10-06'));
assert.deepEqual(packEvents([]),[]);
console.log('PASS: week and year boundaries, leap day, recurrence and non-overlapping event placement across the full day.');
