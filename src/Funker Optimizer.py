'''
MIT License

Copyright (c) 2025 MTGC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''

import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
import tkinter.simpledialog
import xml.etree.ElementTree as ET
from PIL import Image
import webbrowser
import winreg

class FunkerOptimizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Funker' Optimizer")
        self.root.iconbitmap(sys.executable)
        self.root.resizable(0, 0)

        window_width = 830
        window_height = 260
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x_screen = int((screen_width / 2) - (window_width / 2))
        y_screen = int((screen_height / 2) - (window_height / 2))
        self.root.geometry(f"{window_width}x{window_height}+{x_screen}+{y_screen}")

        self.division_number = 2

        self.input_label = tk.Label(root, text="Input Data File:")
        self.input_label.grid(row=0, column=0, padx=5, pady=5, sticky="e")
        self.input_entry = tk.Entry(root, width=50)
        self.input_entry.grid(row=0, column=1, padx=5, pady=5)
        self.input_button = tk.Button(root, text="Browse", command=self.browse_input)
        self.input_button.grid(row=0, column=2, padx=5, pady=5)

        self.output_label = tk.Label(root, text="Output Data File:")
        self.output_label.grid(row=1, column=0, padx=5, pady=5, sticky="e")
        self.output_entry = tk.Entry(root, width=50)
        self.output_entry.grid(row=1, column=1, padx=5, pady=5)
        self.output_button = tk.Button(root, text="Browse", command=self.browse_output)
        self.output_button.grid(row=1, column=2, padx=5, pady=5)

        self.modify_button = tk.Button(root, text="Modify", command=self.modify)
        self.modify_button.grid(row=2, column=1, pady=10)

        self.github_button = tk.Button(root, text="GitHub Repo", command=self.open_github_repo)
        self.github_button.grid(row=2, column=2, pady=10, padx=(10,0))

        self.bug_report_button = tk.Button(root, text="Bug Report", command=self.bug_report)
        self.bug_report_button.grid(row=2, column=1, pady=10, padx=(303,0))

        self.spritesheet_and_xml_generator_button = tk.Button(root, text="SSAXMLG", command=self.spritesheet_and_xml_generator)
        self.spritesheet_and_xml_generator_button.grid(row=2, column=1, columnspan=2, pady=10, padx=(50,0))

        self.message_text = tk.Text(root, height=8, width=70, state='disabled')
        self.message_text.grid(row=3, column=0, columnspan=3, padx=5, pady=5)

        self.right_frame = tk.Frame(root, relief=tk.RIDGE, borderwidth=2)
        self.right_frame.grid(row=0, column=3, rowspan=4, padx=5, pady=5, sticky="n")

        self.image = None
        self.image_label = None

        self.load_image_button = tk.Button(self.right_frame, text="Load Image", command=self.browse_image)
        self.load_image_button.grid(row=0, column=0, padx=5, pady=(20,5))

        self.resize_button = tk.Button(self.right_frame, text="Resize", command=self.resize)
        self.resize_button.grid(row=1, column=0, padx=5, pady=(20,5))

        self.aliasing_var = tk.BooleanVar(value=True)
        self.aliasing_checkbox = tk.Checkbutton(self.right_frame, text="Enable Aliasing (Smooth Resize)", variable=self.aliasing_var)
        self.aliasing_checkbox.grid(row=3, column=0, padx=5, pady=(5,20))

        self.apply_system_theme()

    def detect_system_theme(self):
        try:
            registry = winreg.ConnectRegistry(None, winreg.HKEY_CURRENT_USER)
            key_path = r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
            key = winreg.OpenKey(registry, key_path)
            value, _ = winreg.QueryValueEx(key, "AppsUseLightTheme")
            winreg.CloseKey(key)
            return "light" if value == 1 else "dark"
        except Exception:
            return "light"

    def apply_system_theme(self):
        theme = self.detect_system_theme()
        if theme == "dark":
            bg_color = "#2e2e2e"
            fg_color = "#ffffff"
            entry_bg = "#3c3f41"
            button_bg = "#444444"
        else:
            bg_color = "#f0f0f0"
            fg_color = "#000000"
            entry_bg = "#ffffff"
            button_bg = "#e0e0e0"

        self.root.configure(bg=bg_color)

        widgets = [
            self.input_label, self.input_entry, self.input_button,
            self.output_label, self.output_entry, self.output_button,
            self.modify_button, self.github_button, self.bug_report_button,
            self.spritesheet_and_xml_generator_button, self.message_text,
            self.right_frame, self.load_image_button, self.resize_button,
            self.aliasing_checkbox
        ]

        for widget in widgets:
            if isinstance(widget, tk.Label):
                widget.configure(bg=bg_color, fg=fg_color)
            elif isinstance(widget, tk.Entry):
                widget.configure(bg=entry_bg, fg=fg_color, insertbackground=fg_color)
            elif isinstance(widget, tk.Button):
                widget.configure(bg=button_bg, fg=fg_color, activebackground=button_bg)
            elif isinstance(widget, tk.Text):
                widget.configure(bg=entry_bg, fg=fg_color, insertbackground=fg_color)
            elif isinstance(widget, tk.Frame):
                widget.configure(bg=bg_color)
            elif isinstance(widget, tk.Checkbutton):
                widget.configure(bg=bg_color, fg=fg_color, activebackground=button_bg, selectcolor=bg_color)

        if self.image_label:
            self.image_label.configure(bg=bg_color, fg=fg_color)

    def browse_input(self):
        file_path = filedialog.askopenfilename(
            title="Select Input Data File",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")]
        )
        if file_path:
            self.input_entry.delete(0, tk.END)
            self.input_entry.insert(0, file_path)

    def browse_output(self):
        file_path = filedialog.asksaveasfilename(
            title="Select Output Data File",
            defaultextension=".xml",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")]
        )
        if file_path:
            self.output_entry.delete(0, tk.END)
            self.output_entry.insert(0, file_path)

    def modify(self):
        input_path = self.input_entry.get()
        output_path = self.output_entry.get()

        if not input_path or not os.path.isfile(input_path):
            messagebox.showerror("Error", "Please select a valid input data file.")
            return
        if not output_path:
            messagebox.showerror("Error", "Please select a valid output data file path.")
            return

        try:
            tree = ET.parse(input_path)
        except ET.ParseError as e:
            messagebox.showerror("Data Parse Error", f"Failed to parse data file:\n{e}")
            return
        except Exception as e:
            messagebox.showerror("Error", f"An unexpected error occurred while parsing data:\n{e}")
            return

        try:
            root = tree.getroot()

            for teste in tree.iter('SubTexture'):
                x = teste.get('x')
                y = teste.get('y')
                width = teste.get('width')
                height = teste.get('height')
                fX = teste.get('frameX')
                fY = teste.get('frameY')
                fW = teste.get('frameWidth')
                fH = teste.get('frameHeight')

                if x is not None:
                    teste.set('x', str(int(x) // self.division_number))
                if y is not None:
                    teste.set('y', str(int(y) // self.division_number))
                if width is not None:
                    teste.set('width', str(int(width) // self.division_number))
                if height is not None:
                    teste.set('height', str(int(height) // self.division_number))
                if fX is not None:
                    teste.set('frameX', str(int(fX) // self.division_number))
                if fY is not None:
                    teste.set('frameY', str(int(fY) // self.division_number))
                if fW is not None:
                    teste.set('frameWidth', str(int(fW) // self.division_number))
                if fH is not None:
                    teste.set('frameHeight', str(int(fH) // self.division_number))

            tree.write(output_path, encoding='utf-8', xml_declaration=True)

            if os.path.exists(output_path):
                self.show_message(f"Modified Successfully.\nINPUT='{os.path.abspath(input_path)}'\nOUTPUT='{os.path.abspath(output_path)}'")
            else:
                self.show_message("Error: Output file was not created.")

        except IOError as e:
            messagebox.showerror("File Error", f"File operation failed:\n{e}")
        except Exception as e:
            messagebox.showerror("Error", f"An unexpected error occurred:\n{e}")

    def show_message(self, message):
        self.message_text.config(state='normal')
        self.message_text.delete(1.0, tk.END)
        self.message_text.insert(tk.END, message)
        self.message_text.config(state='disabled')

    def browse_image(self):
        file_path = filedialog.askopenfilename(
            title="Select Image File",
            filetypes=[("Image files", "*.png"), ("All files", "*.*")]
        )
        if file_path:
            try:
                self.image = Image.open(file_path)
            except Exception as e:
                messagebox.showerror("Error", f"Failed to open image file:\n{e}")
                return

            if self.image_label:
                self.image_label.destroy()
                self.image_label = None
            
            file_name = os.path.basename(file_path)
            
            self.image_label = tk.Label(self.right_frame, text=f"File: {file_name}")
            self.image_label.grid(row=2, column=0, padx=5, pady=(20,5))

    def resize(self):
        if hasattr(self, 'image') and self.image:
            percentage_str = tk.simpledialog.askstring("Resize Image", "Enter resize percentage (e.g. 50):")
            if percentage_str is None:
                return
            try:
                percentage = float(percentage_str)
                if percentage <= 0:
                    raise ValueError("Percentage must be positive.")
            except Exception as e:
                messagebox.showerror("Invalid Input", f"Please enter a valid positive number.\n{e}")
                return

            original_width, original_height = self.image.size
            new_width = int(original_width * (percentage / 100))
            new_height = int(original_height * (percentage / 100))
            new_size = (new_width, new_height)

            if self.aliasing_var.get():
                resample_filter = Image.Resampling.LANCZOS
            else:
                resample_filter = Image.Resampling.NEAREST

            try:
                self.image = self.image.resize(new_size, resample_filter)
            except Exception as e:
                messagebox.showerror("Error", f"Failed to resize image:\n{e}")
                return
            
            save_path = filedialog.asksaveasfilename(
                title="Save Resized Image",
                defaultextension=".png",
                filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
            )
            if save_path:
                try:
                    self.image.save(save_path)
                    self.show_message(f"Resized image saved successfully:\n{save_path}")
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to save image:\n{e}")
        else:
            messagebox.showwarning("Warning", "No image loaded to resize.")

    def open_github_repo(self):
        url = "https://github.com/sirthegamercoder/Funker-Optimizer"
        webbrowser.open(url)

    def bug_report(self):
        url = "https://github.com/sirthegamercoder/Funker-Optimizer/issues"
        webbrowser.open(url)

    def spritesheet_and_xml_generator(self):
        url = "https://uncertainprod.github.io/FNF-Spritesheet-XML-generator-Web/"
        webbrowser.open(url)

if __name__ == '__main__':
    root = tk.Tk()
    app = FunkerOptimizer(root)
    root.mainloop()
