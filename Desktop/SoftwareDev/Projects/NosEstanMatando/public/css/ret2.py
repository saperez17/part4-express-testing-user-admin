"""
    Una motobomba llena 0.5m^3 en 3 minutos.
    dado el alto, el ancho y el largo de un tanque.
    determine cuanto tiempo en horas y en minutos 
    tarda en ser llenado el tanque

    parametros:
    ----------
    alto (int): alto del tanque
    ancho (int): ancho del tanque
    largo (int): largo del tanque

    retorna:
    str: cadena de caracteres de la forma 
    'La motobomba llenará el tanque en {minutos} minutos, equivalente a {horas} horas'
"""
def calcular_tiempo_llenado(alto, ancho, largo):
    rate = 0.5/3 #m^3/m
    volume = alto*ancho*largo
    #Use formula w=r*t with w=volume, r=rate and t=time
    t = volume / rate 
    minutes = t
    hours = t/60
    return f"La motobomba llenará el tanque en {minutes} minutos, equivalente a {hours} horas"

if __name__ == "__main__":
    print(calcular_tiempo_llenado(1,1,1))
