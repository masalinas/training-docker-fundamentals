#!/usr/bin/env python3
"""
generate_deck.py - Orquestador principal del generador de la presentación Docker Fundamentals (20H).
Compila secuencialmente los 5 módulos, aplica numeración de diapositivas y guarda Docker_Fundamentals_20H.pptx.
"""

import sys
import os
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Asegurar que el directorio del proyecto está en el path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from generator.theme import (
    create_presentation, FONT_BODY, COLOR_TEXT_MUTED, COLOR_ACCENT_CYAN,
    SLIDE_WIDTH, SLIDE_HEIGHT
)
from generator.module1 import build_module1
from generator.module2_3 import build_module2_3
from generator.module4 import build_module4
from generator.module5 import build_module5


def add_slide_numbers(prs):
    """
    Añade numeración de diapositiva en la esquina inferior derecha.
    Omite la primera diapositiva de portada principal.
    """
    total_slides = len(prs.slides)
    for i, slide in enumerate(prs.slides):
        if i == 0:
            continue  # Omitir portada principal

        box = slide.shapes.add_textbox(Inches(11.3), Inches(7.05), Inches(1.8), Inches(0.35))
        tf = box.text_frame
        tf.word_wrap = False
        tf.margin_left = Inches(0)
        tf.margin_top = Inches(0)
        tf.margin_right = Inches(0)
        tf.margin_bottom = Inches(0)

        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = f"{i + 1} / {total_slides}"
        p.font.name = FONT_BODY
        p.font.size = Pt(9)
        # Si la diapositiva es una portada/cierre oscuro, usar cian tenue; si es clara, gris
        # (detectamos portadas si tienen menos de 4 shapes)
        if len(slide.shapes) <= 4:
            p.font.color.rgb = COLOR_ACCENT_CYAN
        else:
            p.font.color.rgb = COLOR_TEXT_MUTED


def main():
    print("=" * 70)
    print(" COMPILADOR DE SLIDE DECK: DOCKER FUNDAMENTALS (20 HORAS)")
    print("=" * 70)

    prs = create_presentation()
    print("-> Inicializando lienzo panorámico 16:9 (13.333\" x 7.5\")...")

    print("-> Generando Día 1: Módulo 1 (Introducción, Arquitectura y Dockerfile)...")
    slides_m1 = build_module1(prs)
    print(f"   [OK] Módulo 1 completado ({len(slides_m1)} diapositivas)")

    print("-> Generando Día 2: Módulos 2 y 3 (Redes y Volúmenes / Persistencia)...")
    slides_m2_3 = build_module2_3(prs)
    print(f"   [OK] Módulos 2 y 3 completados ({len(slides_m2_3)} diapositivas)")

    print("-> Generando Día 3: Módulo 4 (Contenedores en Cloud y Registries)...")
    slides_m4 = build_module4(prs)
    print(f"   [OK] Módulo 4 completado ({len(slides_m4)} diapositivas)")

    print("-> Generando Día 4: Módulo 5 (Orquestación y Kubernetes)...")
    slides_m5 = build_module5(prs)
    print(f"   [OK] Módulo 5 completado ({len(slides_m5)} diapositivas)")

    total = len(prs.slides)
    print(f"-> Aplicando numeración a {total} diapositivas...")
    add_slide_numbers(prs)

    output_filename = "Docker_Fundamentals_20H.pptx"
    print(f"-> Guardando archivo final: {output_filename}...")
    prs.save(output_filename)

    file_size_kb = os.path.getsize(output_filename) / 1024
    print("=" * 70)
    print(f" ¡ÉXITO! Presentación generada: {output_filename}")
    print(f" - Total Diapositivas: {total} (Rango esperado: 70 - 85)")
    print(f" - Tamaño de archivo: {file_size_kb:.1f} KB")
    print(" - Desglose por Jornadas:")
    print(f"   * Día 1 (Módulo 1): {len(slides_m1)} slides")
    print(f"   * Día 2 (Módulos 2 y 3): {len(slides_m2_3)} slides")
    print(f"   * Día 3 (Módulo 4): {len(slides_m4)} slides")
    print(f"   * Día 4 (Módulo 5 + Cierre): {len(slides_m5)} slides")
    print("=" * 70)


if __name__ == "__main__":
    main()
