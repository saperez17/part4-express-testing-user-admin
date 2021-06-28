def multiply(x,y):
    return x*y

def divide(x,y):
    try:
        res = x/y
        return res
    except ValueError:
        return "Division by zero not defined"
def imprimir(x):
    print(x)
