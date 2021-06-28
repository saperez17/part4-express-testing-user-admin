
from utility import multiply, divide, imprimir
def calcular_cargamento(toneladas):
    # 1ton -> 1000 kg
    # 1 box -> 10kg
    # 1 hass -> 0.25 kg
    # 1 tree -> 40 hass -> 10kg
    kg = multiply(toneladas,1000)
    arboles = divide(kg, 10)
    aguacates = multiply(arboles, 40)
    return_str = f"Para completar {toneladas} toneladas del cargamento se recogieron {aguacates} aguacates de {arboles} arboles"
    return return_str

if __name__ == "__main__":
    imprimir(calcular_cargamento(1))
    imprimir(calcular_cargamento(2))
    imprimir(calcular_cargamento(3))
    imprimir(calcular_cargamento(4))