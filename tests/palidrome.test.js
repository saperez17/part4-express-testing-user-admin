const palidrome = require('../utils/for_testing').palidrome

test('palindrome of a', ()=>{
    const result = palidrome('a')
    expect(result).toBe('a')
})

test('palindrome of react', ()=>{
    const result = palidrome('react')
    expect(result).toBe('tcaer')
})

test('palindrome of releveler', ()=>{
    const result = palidrome('releveler')
    expect(result).toBe('releveler')
})