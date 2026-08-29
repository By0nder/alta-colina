#!/usr/bin/env python3
"""
ALTA COLINA — tratamiento de color de las fotos.

Las fotos vienen del celular, sin editar: colores lavados, dominante cálida y
poco contraste. Esto les aplica el mismo orden que usa un editor profesional
de fotografía inmobiliaria:

    1. balance de blancos   (quitar la dominante de color)
    2. exposición y rango   (estirar sin quemar)
    3. curva de tonos       (contraste en S suave)
    4. saturación           (adaptativa: más a las lavadas, menos a las vivas)
    5. nitidez              (leve, al final)

Lo importante es que sea ADAPTATIVO: una foto ya contrastada no necesita más
contraste. Y que todas terminen pareciéndose entre sí, porque la consistencia
es lo que hace que un conjunto se vea profesional.

NUNCA toca los originales de material/: solo las versiones de material/web/.
Se puede volver a correr sin miedo.
"""
import numpy as np
from PIL import Image, ImageEnhance

# --- cómo queda una foto bien tratada ---
RANGO_META      = 232    # cuánto del 0-255 debe ocupar (contraste)
SATURACION_META = 0.30   # saturación media a la que se apunta
TOPE_SATURACION = 1.38   # más que esto se ve a filtro de celular
FUERZA_BLANCOS  = 0.60   # cuánto se corrige la dominante (1 = del todo)
TOPE_CONTRASTE  = 1.30   # nunca estirar más de esto: evita el look artificial


def _medir(a):
    """Rango dinámico, saturación media y dominante de color.

    La dominante se mide SOLO en los tonos medios. Si se midiera en toda la
    foto, un cielo blanco de neblina arrastraría la corrección y el cielo
    terminaría azul eléctrico.
    """
    g = a.mean(axis=2)
    p2, p98 = np.percentile(g, [2, 98])
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0).mean()

    medios = (g > 55) & (g < 205)
    muestra = a[medios] if medios.sum() > 1000 else a.reshape(-1, 3)
    return p2, p98, sat, muestra.reshape(-1, 3).mean(axis=0)


def _balance_de_blancos(a, medias):
    """Neutraliza la dominante llevando cada canal hacia el gris medio.

    Se aplica a medias (FUERZA_BLANCOS) para no matar la luz cálida del
    atardecer, que ahí sí es parte de la foto.
    """
    objetivo = medias.mean()
    for c in range(3):
        if medias[c] < 1:
            continue
        factor = 1 + (objetivo / medias[c] - 1) * FUERZA_BLANCOS
        factor = min(max(factor, 0.92), 1.10)      # correcciones suaves
        a[..., c] *= factor
    return np.clip(a, 0, 255)


def _estirar(a, p2, p98):
    """Lleva el rango de la foto al que debería tener, sin pasarse."""
    rango = p98 - p2
    if rango < 8:
        return a
    ganancia = min(RANGO_META / rango, TOPE_CONTRASTE)
    if ganancia <= 1.01:
        return a
    centro = (p2 + p98) / 2
    return np.clip((a - centro) * ganancia + centro, 0, 255)


def _curva_s(a, fuerza=0.14):
    """Contraste en S: da cuerpo a los medios sin tapar sombras ni quemar luces."""
    x = a / 255.0
    y = x + fuerza * np.sin(2 * np.pi * x) / (2 * np.pi) * -1
    return np.clip(y, 0, 1) * 255.0


def tratar(im, calidez=1.0):
    """Devuelve la foto tratada. `calidez` > 1 conserva más el tono cálido."""
    a = np.asarray(im.convert("RGB")).astype(float)
    p2, p98, sat, medias = _medir(a)

    a = _balance_de_blancos(a, medias)
    a = _estirar(a, p2, p98)
    a = _curva_s(a)

    y = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    # saturación adaptativa: las lavadas suben mucho, las vivas casi nada.
    # Los tonos claros (cielo, neblina) se protegen: si se saturan, el cielo
    # sale azul de postal y la foto deja de parecer real.
    if sat > 0.01:
        factor = min(max(SATURACION_META / sat, 1.0), TOPE_SATURACION)
        if factor > 1.02:
            antes = np.asarray(y).astype(float)
            subida = np.asarray(ImageEnhance.Color(y).enhance(factor)).astype(float)
            luz = antes.mean(axis=2, keepdims=True) / 255.0
            peso = np.clip((0.82 - luz) / 0.30, 0, 1)     # 0 en las luces altas
            y = Image.fromarray(np.clip(antes * (1 - peso) + subida * peso, 0, 255).astype(np.uint8))

    if calidez != 1.0:
        b = np.asarray(y).astype(float)
        b[..., 0] = np.clip(b[..., 0] * calidez, 0, 255)
        b[..., 2] = np.clip(b[..., 2] / calidez, 0, 255)
        y = Image.fromarray(b.astype(np.uint8))

    return ImageEnhance.Sharpness(y).enhance(1.18)


def resumen(im):
    """Para comprobar cómo quedó: rango, saturación y dominante."""
    a = np.asarray(im.convert("RGB")).astype(float)
    p2, p98, sat, medias = _medir(a)
    return {
        "rango": round(p98 - p2),
        "saturacion": round(sat * 100),
        "dominante": round(float(medias.max() - medias.mean()), 1),
    }
